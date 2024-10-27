# Scanorama Film Scraper

A tool to scrape feature film data from Scanorama and export it to CSV format
for Letterboxd import.

Scanorama is a film festival in Lithuania held annually in November.

This scraper was used to create the curated film list
**[Scanorama 2024](https://letterboxd.com/mat2s/list/scanorama-2024/)** on
Letterboxd.

## Compatibility with Scanorama

The **Scanorama Film Scraper** works with the Scanorama website from 2021
onward. To scrape data for previous years, you need to modify the URLs in the
`remote.ts` file.

### Accessing Archived Data

1. **Current Year URL**: https://www.scanorama.lt/lt/edition/2024
2. **Archived Year URL**: https://www.scanorama.lt/lt/archive/YYYY

## Requirements

- [Deno](https://deno.com/) (version 2.x or higher) installed on your machine.

## Usage

1. **Run the Script**

   Use the following command to execute the script.

   ```bash
   deno run start
   ```
