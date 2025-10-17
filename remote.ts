async function fetchFeatureFilms(
  { token, version }: AuthOptions
): Promise<FilmList> {
  const response = await fetch(
    "https://www.scanorama.lt/lt/edition/2025?type=feature",
    {
      headers: {
        "x-inertia": "true",
        "x-inertia-version": version,
        "x-xsrf-token": token,
      },
    }
  );

  return await response.json();
}

type FilmList = {
  props: {
    films: { id: number; slug: string }[];
  };
};

async function fetchFilm(
  slug: string,
  { token, version }: AuthOptions
): Promise<Film> {
  const response = await fetch(
    `https://www.scanorama.lt/lt/edition/2025/films/${slug}`,
    {
      headers: {
        "x-inertia": "true",
        "x-inertia-version": version,
        "x-xsrf-token": token,
      },
    }
  );

  return await response.json();
}

type Film = {
  props: {
    film: {
      external_link: {
        url: string;
        label: string;
      };
      type: string;
      title: string;
      original_title: string;
      release_year: string;
      people: { role: string; name: string }[];
    };
  };
};

async function authenticate(): Promise<AuthOptions> {
  const response = await fetch("https://www.scanorama.lt/lt/");
  const cookieString = response.headers.get("set-cookie");

  if (!cookieString) {
    throw new Error("'set-cookie' header is missing");
  }

  const text = await response.text();
  const version = parseVersion(text);

  if (!version) {
    throw new Error("inertia version was not found");
  }

  const token = parseToken(cookieString);

  if (!token) {
    throw new Error("token was not found");
  }

  return {
    token,
    version,
  };
}

type AuthOptions = {
  token: string;
  version: string;
};

const parseToken = (input: string): string | null => {
  const match = input.match(/XSRF-TOKEN=([^;]+)/);

  return match ? decodeURIComponent(match[1]) : null;
};

const parseVersion = (input: string): string | null => {
  const match = input.match(/version&quot;:&quot;([a-f0-9]+)&quot;/);

  return match ? match[1] : null;
};

export const Remote = {
  authenticate,
  fetchFeatureFilms,
  fetchFilm,
}