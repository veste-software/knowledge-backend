import AuthLogo from "./extensions/Copyright.png";
import MenuLogo from "./extensions/Copyright.png";
import favicon from "./extensions/copyright-32x32.png";
import CustomHomePage from './extensions/CustomHomePage';

export default {
  config: {
    // Replace the Strapi logo in auth (login) views
    auth: {
      logo: AuthLogo,
    },
    // Replace the favicon
    head: {
      favicon: favicon,
    },
    // Add a new locale, other than 'en'
    locales: ["fr", "de"],
    // Replace the Strapi logo in the main navigation
    menu: {
      logo: MenuLogo,
    },
    // Override or extend the theme
    theme: {
      // overwrite light theme properties
      light: {
        colors: {
          primary100: "#f6ecfc",
          primary200: "#e0c1f4",
          primary500: "#ac73e6",
          primary600: "#9736e8",
          primary700: "#8312d1",
          danger700: "#b72b1a",
        },
      },

      // overwrite dark theme properties
      dark: {
        // ...
      },
    },
    // Extend the translations
    translations: {
    en: {
    "app.components.HomePage.welcome": "Copyright Knowledge Admin Dashboard",
    "app.components.HomePage.welcome.again": "Copyright Knowledge Admin Dashboard",
    "app.components.BlockLink.blog": "Graph Visualization",
    "app.components.BlockLink.blog.content": "A customizable graph visualization tool that can be used to visualize the relationships between different data points",
    "global.documentation": "GraphQL Builder",
    "app.components.BlockLink.documentation.content": "The Apollo GraphQL Studio can be used to construct queries that can be used to access the copyright data from external websites",
    "app.components.BlockLink.code": "Documentation",
    "app.components.HomePage.welcomeBlock.content.again": "Welcome to our Copyright Teams Collaboration Tool!",
    "app.components.BlockLink.code.content": "For basic Strapi documentation, please click the bottom right button. For more advanced documentation, please click the top right button.",
    },
      fr: {
        "Auth.form.email.label": "test",
        Users: "Utilisateurs",
        City: "CITY (FRENCH)",
        // Customize the label of the Content Manager table.
        Id: "ID french",
      },
    },
    // Disable video tutorials
    tutorials: true,
    // Disable notifications about new Strapi releases
    notifications: { releases: false },
  },

  bootstrap(app) {

  console.debug("app is", app);
    // Customize the admin homepage

//    app.getPlugin('content-manager').injectComponent('homepage', 'right', {
//      name: 'my-custom-homepage-component',
//      Component: () => 'This is my custom homepage component',
//    });
//
//    strapi.admin.registerPlugin({
//      id: 'custom-homepage',
//      isReady: false, // This will be set to true once your custom homepage is ready
//      name: 'Custom Homepage',
//      injectionZones: {
//        'admin.pages.HomePage': CustomHomePage,
//      },
//    });
  },
};
