# Graph Report - AccSoft  (2026-05-08)

## Corpus Check
- 147 files · ~20,833 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 619 nodes · 632 edges · 81 communities (39 shown, 42 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]

## God Nodes (most connected - your core abstractions)
1. `IDbConnectionFactory` - 12 edges
2. `ReportService` - 10 edges
3. `ReportController` - 9 edges
4. `IMapper` - 9 edges
5. `ReportService` - 9 edges
6. `ReportRepository` - 9 edges
7. `CategoryService` - 8 edges
8. `EventService` - 8 edges
9. `DonorService` - 8 edges
10. `VendorService` - 8 edges

## Surprising Connections (you probably didn't know these)
- `AuthService` --references--> `IConfiguration`  [EXTRACTED]
  Backend/DemoProject.Business/Services/AuthService.cs → Backend/DemoProject.Data/ConnectionFactory/DbConnectionFactory.cs
- `CategoryService` --references--> `IMapper`  [EXTRACTED]
  Backend/DemoProject.Business/Services/CategoryService.cs → Backend/DemoProject.Business/Services/TransactionServices.cs
- `ReimbursementService` --references--> `IMapper`  [EXTRACTED]
  Backend/DemoProject.Business/Services/MoreTransactionServices.cs → Backend/DemoProject.Business/Services/TransactionServices.cs
- `AssetService` --references--> `IMapper`  [EXTRACTED]
  Backend/DemoProject.Business/Services/MoreTransactionServices.cs → Backend/DemoProject.Business/Services/TransactionServices.cs
- `BankTransferService` --references--> `IMapper`  [EXTRACTED]
  Backend/DemoProject.Business/Services/MoreTransactionServices.cs → Backend/DemoProject.Business/Services/TransactionServices.cs

## Communities (81 total, 42 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (17): ControllerBase, AuthController, DemoProject.API.Controllers, AssetController, BankTransferController, DemoProject.API.Controllers, ReimbursementController, DemoProject.API.Controllers (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (14): DemoProject.API.Controllers, DonorController, EventController, VendorController, IDonorService, IEventRepository, IEventService, IMapper (+6 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (11): IAssetRepository, IBankTransferRepository, AssetRepository, BankTransferRepository, DemoProject.Repository.Implementations, ReimbursementRepository, IReimbursementRepository, AssetService (+3 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (15): DbConnectionFactory, DemoProject.Data.ConnectionFactory, IAuthService, IConfiguration, IDbConnectionFactory, IDonorRepository, DemoProject.Repository.Implementations, DonorRepository (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (8): DemoProject.API.Controllers, ReportController, DemoProject.Repository.Implementations, ReportRepository, IReportRepository, IReportService, DemoProject.Business.Services, ReportService

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (9): DemoProject.Repository.Implementations, PaymentRepository, ReceiptRepository, IPaymentRepository, IReceiptRepository, IReceiptService, DemoProject.Business.Services, PaymentService (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (8): CategoryController, DemoProject.API.Controllers, ICategoryRepository, ICategoryService, CategoryRepository, DemoProject.Repository.Implementations, CategoryService, DemoProject.Business.Services

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (4): DemoProject.Business.Interfaces, IDonorService, IEventService, IVendorService

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (4): DemoProject.Business.Interfaces, IAssetService, IBankTransferService, IReimbursementService

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (4): DemoProject.Repository.Interfaces, IDonorRepository, IEventRepository, IVendorRepository

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (4): DemoProject.Repository.Interfaces, IAssetRepository, IBankTransferRepository, IReimbursementRepository

### Community 12 - "Community 12"
Cohesion: 0.17
Nodes (3): CategoriesComponent, Category, CategoryService

### Community 13 - "Community 13"
Cohesion: 0.15
Nodes (9): CategoryProfile, DemoProject.Business.DTOs, DemoProject.Business.DTOs, MasterProfiles, DemoProject.Business.DTOs, MoreTransactionProfiles, DemoProject.Business.DTOs, TransactionProfiles (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.17
Nodes (3): DemoProject.Business.Interfaces, IPaymentService, IReceiptService

### Community 15 - "Community 15"
Cohesion: 0.17
Nodes (3): DemoProject.Repository.Interfaces, IPaymentRepository, IReceiptRepository

### Community 16 - "Community 16"
Cohesion: 0.29
Nodes (5): AppComponent, compiled, fixture, appConfig, routes

### Community 19 - "Community 19"
Cohesion: 0.25
Nodes (7): CreateDonorDto, CreateEventDto, CreateVendorDto, DemoProject.Business.DTOs, DonorDto, EventDto, VendorDto

### Community 20 - "Community 20"
Cohesion: 0.25
Nodes (7): AssetDto, BankTransferDto, CreateAssetDto, CreateBankTransferDto, CreateReimbursementDto, DemoProject.Business.DTOs, ReimbursementDto

### Community 21 - "Community 21"
Cohesion: 0.25
Nodes (7): CategoryExpenseModel, DemoProject.Data.Entities, DonorReceiptModel, EventPNLModel, IncomeExpenditureModel, PaymentRegisterModel, ReceiptRegisterModel

### Community 22 - "Community 22"
Cohesion: 0.25
Nodes (7): Build, Code scaffolding, DemoProject, Development server, Further help, Running end-to-end tests, Running unit tests

### Community 27 - "Community 27"
Cohesion: 0.33
Nodes (5): CreatePaymentDto, CreateReceiptDto, DemoProject.Business.DTOs, PaymentDto, ReceiptDto

### Community 28 - "Community 28"
Cohesion: 0.4
Nodes (4): AuthResponseDto, DemoProject.Business.DTOs, LoginDto, UserDto

### Community 29 - "Community 29"
Cohesion: 0.4
Nodes (4): CategoryDto, CreateCategoryDto, DemoProject.Business.DTOs, UpdateCategoryDto

### Community 30 - "Community 30"
Cohesion: 0.4
Nodes (4): DemoProject.Data.Entities, Donor, Event, Vendor

### Community 31 - "Community 31"
Cohesion: 0.4
Nodes (4): Asset, BankTransfer, DemoProject.Data.Entities, Reimbursement

### Community 35 - "Community 35"
Cohesion: 0.5
Nodes (3): DemoProject.Data.Entities, Payment, Receipt

## Knowledge Gaps
- **100 isolated node(s):** `WeatherForecast`, `DemoProject.API.Controllers`, `DemoProject.API.Controllers`, `DemoProject.API.Controllers`, `DemoProject.API.Controllers` (+95 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `IDbConnectionFactory` connect `Community 3` to `Community 2`, `Community 4`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `IMapper` connect `Community 1` to `Community 2`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `ReportRepository` connect `Community 4` to `Community 3`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `WeatherForecast`, `DemoProject.API.Controllers`, `DemoProject.API.Controllers` to the rest of the system?**
  _100 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._