# SmartMoving Cloud

All cloud-related code lives here.

## Getting Started Locally

You will need .NET Core 3.1, Tools, etc, and obviously a code editor. The team uses a mix of the following:

- Latest Visual Studio
- Rider
- VSCode

The most important part is that your editor respects editor.config properly. If you're editing recently created code, save, and see a bunch of whitespace changes, you
likely have something misconfigured.

Run `dotnet dev-certs https --trust`

Run `dotnet tool install --global dotnet-ef` if you plan on adding migrations.

## Your database

You need to have LocalDB installed. The application itself will create the actual database (SmartMoving_Interview, SmartMoving_Interview_Specs), needed schema, and keep
it up to date. You can delete this database and let it recreate it if needed.