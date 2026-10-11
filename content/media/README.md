# Project images

Put screenshots and posts here, one folder per project, named after the project file:

    content/media/aarogya-matrix/home.png
    content/media/aarogya-matrix/home-mobile.png

`npm run images` (also run automatically by `dev` and `build`) turns them into AVIF and WebP
at several widths. Reference them from a project's MDX file:

    <Screenshot src="aarogya-matrix/home.png" alt="Aarogya Matrix home page on desktop" />

Use PNG for screenshots and JPG for photos. Large originals are fine; they are never shipped as-is.
