# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Design assets

- **Hero photos** live in `public/images` and are committed. `pnpm generate-hero-images` rebuilds them from the full-size originals (downloaded into `.cache/photos` on first run). When the widths change, update `src/components/hero/hero.component.tsx` and the preload tags in `public/index.html` too.
- **Social preview** (`public/og-image.png`) is a static render of `scripts/og-image.html`. The comment at the top of that file explains how to refresh it.
- **Fonts** are Sofia Sans and Sofia Sans Condensed, self-hosted through `@fontsource-variable`.

### Photo credits

Both photos are CC0 (public domain), originally published on Unsplash:

- Tent at dusk: [Cristian Grecu](https://commons.wikimedia.org/wiki/File:Cristian_Grecu_2017-05-23_(Unsplash_xQYW7brEauY).jpg)
- Tent above the clouds: [Christopher Jolly](https://commons.wikimedia.org/wiki/File:Camping_in_the_mountains_(Unsplash).jpg)
