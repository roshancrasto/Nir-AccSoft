using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(options =>
{
    options.Filters.Add(new Microsoft.AspNetCore.Mvc.Authorization.AuthorizeFilter());
    options.Filters.Add<DemoProject.API.Filters.PermissionFilter>();
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "DemoProject API", Version = "v1" });
});

// Dependency Injection
builder.Services.AddSingleton<DemoProject.Data.ConnectionFactory.IDbConnectionFactory, DemoProject.Data.ConnectionFactory.DbConnectionFactory>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IUserRepository, DemoProject.Repository.Implementations.UserRepository>();
builder.Services.AddScoped<DemoProject.Repository.Interfaces.IMemberRepository, DemoProject.Repository.Implementations.MemberRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IAuthService, DemoProject.Business.Services.AuthService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.ISecurityRepository, DemoProject.Repository.Implementations.SecurityRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.ISecurityService, DemoProject.Business.Services.SecurityService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.ICategoryRepository, DemoProject.Repository.Implementations.CategoryRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.ICategoryService, DemoProject.Business.Services.CategoryService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IEventGroupRepository, DemoProject.Repository.Implementations.EventGroupRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IEventGroupService, DemoProject.Business.Services.EventGroupService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IDonorRepository, DemoProject.Repository.Implementations.DonorRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IDonorService, DemoProject.Business.Services.DonorService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IVendorRepository, DemoProject.Repository.Implementations.VendorRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IVendorService, DemoProject.Business.Services.VendorService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.ILanguageMasterRepository, DemoProject.Repository.Implementations.LanguageMasterRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.ILanguageMasterService, DemoProject.Business.Services.LanguageMasterService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IEventCategoryRepository, DemoProject.Repository.Implementations.EventCategoryRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IEventCategoryService, DemoProject.Business.Services.EventCategoryService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IEventDetailRepository, DemoProject.Repository.Implementations.EventDetailRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IEventDetailService, DemoProject.Business.Services.EventDetailService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IReceiptRepository, DemoProject.Repository.Implementations.ReceiptRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IReceiptService, DemoProject.Business.Services.ReceiptService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IPaymentRepository, DemoProject.Repository.Implementations.PaymentRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IPaymentService, DemoProject.Business.Services.PaymentService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IPaymentExpenseLinkRepository, DemoProject.Repository.Implementations.PaymentExpenseLinkRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IPaymentExpenseLinkService, DemoProject.Business.Services.PaymentExpenseLinkService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IReimbursementRepository, DemoProject.Repository.Implementations.ReimbursementRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IReimbursementService, DemoProject.Business.Services.ReimbursementService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IAssetRepository, DemoProject.Repository.Implementations.AssetRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IAssetService, DemoProject.Business.Services.AssetService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IBankTransferRepository, DemoProject.Repository.Implementations.BankTransferRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IBankTransferService, DemoProject.Business.Services.BankTransferService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IReportRepository, DemoProject.Repository.Implementations.ReportRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IReportService, DemoProject.Business.Services.ReportService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IInternalAccountRepository, DemoProject.Repository.Implementations.InternalAccountRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IInternalAccountService, DemoProject.Business.Services.InternalAccountService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IBoxCollectionRepository, DemoProject.Repository.Implementations.BoxCollectionRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IBoxCollectionService, DemoProject.Business.Services.BoxCollectionService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IGovtGrantRepository, DemoProject.Repository.Implementations.GovtGrantRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IGovtGrantService, DemoProject.Business.Services.GovtGrantService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IOpeningBalanceRepository, DemoProject.Repository.Implementations.OpeningBalanceRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IOpeningBalanceService, DemoProject.Business.Services.OpeningBalanceService>();

builder.Services.AddScoped<DemoProject.Repository.Interfaces.IDashboardRepository, DemoProject.Repository.Implementations.DashboardRepository>();
builder.Services.AddScoped<DemoProject.Business.Interfaces.IDashboardService, DemoProject.Business.Implementations.DashboardService>();

// AutoMapper
builder.Services.AddAutoMapper(cfg => {
    cfg.AddMaps(typeof(DemoProject.Business.DTOs.CategoryProfile).Assembly);
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["Key"] ?? "DefaultSecretKey123!@#";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
