-- Stored Procedures for Donors

CREATE OR ALTER PROCEDURE NU_sp_Donor_Insert
    @DonorName NVARCHAR(150),
    @MobileNumber NVARCHAR(20),
    @DPlace NVARCHAR(100),
    @DAddr1 NVARCHAR(200),
    @DAddr2 NVARCHAR(200),
    @DAddr3 NVARCHAR(200),
    @DCity NVARCHAR(100),
    @DState NVARCHAR(100),
    @IsUdyavarParish BIT,
    @PANNumber NVARCHAR(20),
    @Email NVARCHAR(100),
    @Remarks NVARCHAR(MAX),
    @CreatedBy INT
AS
BEGIN
    INSERT INTO NU_Donors (DonorName, MobileNumber, DPlace, DAddr1, DAddr2, DAddr3, DCity, DState, IsUdyavarParish, PANNumber, Email, Remarks, IsActive, CreatedBy, ModifiedDate)
    VALUES (@DonorName, @MobileNumber, @DPlace, @DAddr1, @DAddr2, @DAddr3, @DCity, @DState, @IsUdyavarParish, @PANNumber, @Email, @Remarks, 1, @CreatedBy, GETDATE());
    
    SELECT SCOPE_IDENTITY() AS DonorId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Donor_Update
    @DonorId INT,
    @DonorName NVARCHAR(150),
    @MobileNumber NVARCHAR(20),
    @DPlace NVARCHAR(100),
    @DAddr1 NVARCHAR(200),
    @DAddr2 NVARCHAR(200),
    @DAddr3 NVARCHAR(200),
    @DCity NVARCHAR(100),
    @DState NVARCHAR(100),
    @IsUdyavarParish BIT,
    @PANNumber NVARCHAR(20),
    @Email NVARCHAR(100),
    @Remarks NVARCHAR(MAX),
    @IsActive BIT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_Donors
    SET DonorName = @DonorName,
        MobileNumber = @MobileNumber,
        DPlace = @DPlace,
        DAddr1 = @DAddr1,
        DAddr2 = @DAddr2,
        DAddr3 = @DAddr3,
        DCity = @DCity,
        DState = @DState,
        IsUdyavarParish = @IsUdyavarParish,
        PANNumber = @PANNumber,
        Email = @Email,
        Remarks = @Remarks,
        IsActive = @IsActive,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE DonorId = @DonorId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Donor_Delete
    @DonorId INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_Donors
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE DonorId = @DonorId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Donor_GetAll
AS
BEGIN
    SELECT DonorId, DonorName, MobileNumber, DPlace, DAddr1, DAddr2, DAddr3, DCity, DState, IsUdyavarParish, PANNumber, Email, Remarks, IsActive
    FROM NU_Donors
    WHERE DeletedFlag = 0;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Donor_GetById
    @DonorId INT
AS
BEGIN
    SELECT DonorId, DonorName, MobileNumber, DPlace, DAddr1, DAddr2, DAddr3, DCity, DState, IsUdyavarParish, PANNumber, Email, Remarks, IsActive
    FROM NU_Donors
    WHERE DonorId = @DonorId AND DeletedFlag = 0;
END;
GO
