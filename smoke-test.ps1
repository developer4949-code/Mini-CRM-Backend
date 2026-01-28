
$baseUrl = "http://localhost:3000"

function Test-Endpoint($Name, $Command) {
    Write-Host "`n[TESTING] $Name..." -ForegroundColor Cyan
    try {
        $result = Invoke-Expression $Command
        Write-Host "[SUCCESS] $Name" -ForegroundColor Green
        return $result
    } catch {
        Write-Host "[FAILED] $Name" -ForegroundColor Red
        Write-Host $_
        return $null
    }
}

# 1. Register Admin
$adminData = @{
    name = "Admin User"
    email = "admin@example.com"
    password = "password123"
    role = "ADMIN"
} | ConvertTo-Json

Test-Endpoint "Register Admin" "curl -s -X POST $baseUrl/auth/register -H 'Content-Type: application/json' -d '$adminData'"

# 2. Login Admin
$loginData = @{
    email = "admin@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Test-Endpoint "Login Admin" "curl -s -X POST $baseUrl/auth/login -H 'Content-Type: application/json' -d '$loginData'"
$adminToken = ($loginResponse | ConvertFrom-Json).data.accessToken
Write-Host "Admin Token: $adminToken"

# 3. Register Employee
$empData = @{
    name = "Employee User"
    email = "employee@example.com"
    password = "password123"
    role = "EMPLOYEE"
} | ConvertTo-Json

Test-Endpoint "Register Employee" "curl -s -X POST $baseUrl/auth/register -H 'Content-Type: application/json' -d '$empData'"

# 4. Login Employee
$loginEmpData = @{
    email = "employee@example.com"
    password = "password123"
} | ConvertTo-Json

$loginEmpResponse = Test-Endpoint "Login Employee" "curl -s -X POST $baseUrl/auth/login -H 'Content-Type: application/json' -d '$loginEmpData'"
$empToken = ($loginEmpResponse | ConvertFrom-Json).data.accessToken
$empId = ($loginEmpResponse | ConvertFrom-Json).data.user.id
Write-Host "Employee Token: $empToken, ID: $empId"

# 5. Admin - Get All Users
Test-Endpoint "Admin - Get All Users" "curl -s -X GET $baseUrl/users -H 'Authorization: Bearer $adminToken'"

# 6. Admin child-creating a customer
$customerData = @{
    name = "Demo Customer"
    email = "customer@demo.com"
    phone = "1234567890"
    company = "Demo Corp"
} | ConvertTo-Json

$customerResponse = Test-Endpoint "Admin - Create Customer" "curl -s -X POST $baseUrl/customers -H 'Authorization: Bearer $adminToken' -H 'Content-Type: application/json' -d '$customerData'"
$customerId = ($customerResponse | ConvertFrom-Json).data.id

# 7. Admin - Create Task for Employee
$taskData = @{
    title = "Complete Onboarding"
    description = "Finish all HR paperwork"
    assignedTo = [int]$empId
    customerId = [int]$customerId
} | ConvertTo-Json

$taskResponse = Test-Endpoint "Admin - Create Task" "curl -s -X POST $baseUrl/tasks -H 'Authorization: Bearer $adminToken' -H 'Content-Type: application/json' -d '$taskData'"
$taskId = ($taskResponse | ConvertFrom-Json).data.id

# 8. Employee - Get Assigned Tasks
Test-Endpoint "Employee - Get Assigned Tasks" "curl -s -X GET $baseUrl/tasks -H 'Authorization: Bearer $empToken'"

# 9. Employee - Update Task Status
$statusData = @{
    status = "IN_PROGRESS"
} | ConvertTo-Json

Test-Endpoint "Employee - Update Task Status" "curl -s -X PATCH $baseUrl/tasks/$taskId/status -H 'Authorization: Bearer $empToken' -H 'Content-Type: application/json' -d '$statusData'"

# 10. Employee - Try to create customer (Should fail 403)
Write-Host "`n[EXPECTED FAILURE] Employee trying to create customer..." -ForegroundColor Yellow
curl -s -X POST $baseUrl/customers -H "Authorization: Bearer $empToken" -H "Content-Type: application/json" -d "{\"name\":\"Fail\"}"

# 11. Verification complete
Write-Host "`n[COMPLETE] All smoke tests finished." -ForegroundColor Green
