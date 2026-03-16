using BookstoreApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Enable CORS so our React frontend is allowed to talk to this API
builder.Services.AddControllers();
builder.Services.AddCors();

// Connect to the SQLite database file named "Bookstore.sqlite"
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite("Data Source=Bookstore.sqlite"));

var app = builder.Build();

app.UseCors(x => x
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin());
app.UseAuthorization();

app.MapControllers();

app.Run();