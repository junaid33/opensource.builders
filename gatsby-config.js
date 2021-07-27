module.exports = {
  siteMetadata: {
    title: `Opensource.builders`,
    author: `Junaid Kabani`,
    description: `Find open-source alternatives to popular software`,
    siteUrl: `https://opensource.builders/`,
    social: {
      github: `junaid33`,
    },
  },
  plugins: [
    {
      enabled: process.env.NODE_ENV !== 'production',
      resolve: "gatsby-plugin-tinacms",
      options: {
        plugins: [
          "gatsby-tinacms-git",
          "gatsby-tinacms-remark",
          "gatsby-tinacms-json",
        ],
        sidebar: {
          position: "displace",
        },
      },
    },
    {
      resolve: "gatsby-plugin-chakra-ui",
      options: {
        /**
         * if false, this plugin will not use `<CSSReset />
         */
        isResettingCSS: true,
        /**
         * if false, this plugin will not use <ColorModeProvider />
         */
        isUsingColorMode: false,
      },
    },
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./src/components/layout`),
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/data`,
        name: `data`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/alts`,
        name: `alts`,
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: "gatsby-plugin-fathom",
      options: {
        // Fathom server URL. Defaults to `cdn.usefathom.com`
        trackingUrl: "fathom-anjh.onrender.com",
        // Unique site id
        siteId: "IRCCY",
        // Domain whitelist
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Opensource.builders`,
        short_name: `Opensource.builders`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/favicon.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    // {
    //   resolve: `gatsby-plugin-typography`,
    //   options: {
    //     pathToConfigModule: `src/utils/typography`,
    //   },
    // },
  ],
}
