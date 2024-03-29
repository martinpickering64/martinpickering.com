// .tina/config.js
import { defineConfig } from "tinacms";
var branch = "develop";
var config_default = defineConfig({
  branch,
  clientId: "65446e91-8e39-4c76-b232-a60340e867b0",
  // Get this from tina.io
  token: "c284168b9cec60515687cddf0fb40be7573ffaf4",
  // Get this from tina.io
  build: {
    outputFolder: "admin",
    publicFolder: "static"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "static"
    }
  },
  schema: {
    collections: [
      {
        label: "Blog Posts",
        name: "posts",
        path: "content/posts",
        format: "md",
        defaultItem: () => {
          return {
            title: "New Post",
            date: (/* @__PURE__ */ new Date()).toISOString()
          };
        },
        ui: {
          filename: {
            slugify: (values) => {
              return `${values.title.toLowerCase().replace(/\W+/g, "-")}`;
            }
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            description: "The Title of the Blog Post",
            isBody: false,
            isTitle: true,
            required: true,
            ui: {
              validate: (value, data) => {
                const lengthOfTitle = value?.length || 0;
                if (lengthOfTitle < 3) {
                  return "A Title must be at least 3 characters long";
                }
                if (lengthOfTitle > 100) {
                  return "A Title must be at most 100 characters long";
                }
              }
            }
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            description: "A brief summary of the Blog Post",
            required: true,
            ui: {
              component: "textarea",
              validate: (value, data) => {
                const lengthOfTitle = value?.length || 0;
                if (lengthOfTitle < 3) {
                  return "The Summary must be at least 3 characters long";
                }
                if (lengthOfTitle > 250) {
                  return "The Summary must be at most 250 characters long";
                }
              }
            }
          },
          {
            label: "Date",
            name: "date",
            type: "datetime",
            required: true,
            ui: {
              dateFormat: "DD/MM/YYYY hh:mm A ZZ"
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Document Body",
            description: "This is the document body written in markdown",
            isBody: true,
            required: false
          },
          {
            type: "string",
            name: "categories",
            label: "Category",
            description: "The name of a Category",
            required: true,
            ui: {
              validate: (value, data) => {
                const lengthOfTitle = value?.length || 0;
                if (lengthOfTitle < 3) {
                  return "Needs at least 3 characters";
                }
                if (lengthOfTitle > 100) {
                  return "At most 100 characters";
                }
              }
            }
          },
          {
            label: "Tags",
            name: "tags",
            type: "string",
            list: true
          }
        ]
      },
      {
        label: "Pages",
        name: "pages",
        path: "content",
        format: "md",
        defaultItem: () => {
          return {
            title: "Well this is new!",
            date: (/* @__PURE__ */ new Date()).toISOString()
          };
        },
        ui: {
          filename: {
            slugify: (values) => {
              return `${values.title.toLowerCase().replace(/\W+/g, "-")}`;
            }
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            description: "The Title of the Page",
            isBody: false,
            isTitle: true,
            required: true,
            ui: {
              validate: (value, data) => {
                const lengthOfTitle = value?.length || 0;
                if (lengthOfTitle < 3) {
                  return "A Title must be at least 3 characters long";
                }
                if (lengthOfTitle > 100) {
                  return "A Title must be at most 100 characters long";
                }
              }
            }
          },
          {
            label: "Date",
            name: "date",
            type: "datetime",
            required: true,
            ui: {
              dateFormat: "DD/MM/YYYY hh:mm A ZZ"
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Document Body",
            description: "This is the document body written in markdown",
            isBody: true,
            required: false
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
