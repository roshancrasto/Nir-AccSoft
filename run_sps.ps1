$files = Get-ChildItem "e:\Work\AccSoft\Database\StoredProcedures\*.sql"
foreach ($file in $files) {
    Write-Host "Executing $($file.Name)..."
    sqlcmd -S TKTLT-ROSHAN -d AccSoft -E -i $file.FullName
}
