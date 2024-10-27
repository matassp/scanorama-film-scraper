import { Remote } from "./remote.ts";

(async function main() {
  const authOptions = await Remote.authenticate();
  const featureFilms = await Remote.fetchFeatureFilms(authOptions);
  const filmSlugs = featureFilms.props.films.map(({ slug }) => slug);

  const films = (
    await Promise.all(
      filmSlugs.map((slug) =>
        Remote.fetchFilm(slug, authOptions).then((film) => film.props.film)
      )
    )
  )
    .filter((film) => film.type === "feature")
    .map((film): FilmCSV => {
      const imdbID = extractImdbId(film.external_link?.url) ?? "";
      const Title = film.original_title ?? film.title ?? "";
      const Year = film.release_year ?? "";

      const directorsArray =
        film.people
          ?.filter((person) => person.role.startsWith("Re"))
          ?.map((person) => person.name) ?? [];
      const Directors =
        directorsArray.length > 0 ? `${directorsArray.join(",")}` : "";

      return {
        imdbID,
        Title,
        Year,
        Directors,
      };
    });

  await Deno.mkdir("./output", { recursive: true });
  await Deno.writeTextFile(
    `./output/sca-2024-films-${getTimeString()}.csv`,
    arrayToCSV(films)
  );
})();

/**
 * Type definition for a Film object represented in CSV format.
 *
 * For more information on importing data into Letterboxd, please refer to
 * the following link: [Letterboxd Importing Data](https://letterboxd.com/about/importing-data/).
 */
type FilmCSV = {
  imdbID?: string;
  Title?: string;
  Year?: string;
  Directors?: string;
};

function arrayToCSV(data: { [key: string]: string }[]): string {
  const headers = Object.keys(data[0]).join(",");

  const rows = data.map((row) =>
    Object.values(row)
      .map((value) =>
        typeof value === "string" && value.includes(",") ? `"${value}"` : value
      )
      .join(",")
  );

  return `${headers}\n${rows.join("\n")}`;
}

function extractImdbId(url: string | null) {
  if (!url || !url.includes("imdb.com")) {
    return null;
  }

  const match = url.match(/\/title\/(tt\d+)\//);
  return match ? match[1] : null;
}

function getTimeString() {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
