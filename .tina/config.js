import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  branch,
  clientId: null, // Get this from tina.io
  token: null, // Get this from tina.io
  build: {
    outputFolder: "admin",
    publicFolder: "static",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "static",
    },
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
            title: 'New Post',
            date: new Date().toISOString()
          }
        },
        ui: {
          filename: {
            slugify: values => { return `${values.title.toLowerCase().replace(/\W+/g, '-')}` }
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
              validate: (value, data)=>{
                const lengthOfTitle = value?.length || 0
                if(lengthOfTitle < 3){
                  return 'A Title must be at least 3 characters long'
                }
                if(lengthOfTitle > 100){
                  return 'A Title must be at most 100 characters long'
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
              validate: (value, data)=>{
                const lengthOfTitle = value?.length || 0
                if(lengthOfTitle < 3){
                  return 'The Summary must be at least 3 characters long'
                }
                if(lengthOfTitle > 250){
                  return 'The Summary must be at most 250 characters long'
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
              dateFormat: 'DD/MM/YYYY hh:mm A ZZ'
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
              validate: (value, data)=>{
                const lengthOfTitle = value?.length || 0
                if(lengthOfTitle < 3){
                  return 'Needs at least 3 characters'
                }
                if(lengthOfTitle > 100){
                  return 'At most 100 characters'
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
        ],
      },
      {
        label: "Pages",
        name: "pages",
        path: "content",
        format: "md",
        defaultItem: () => {
          return {
            title: 'Well this is new!',
            date: new Date().toISOString()
          }
        },
        ui: {
          filename: {
            slugify: values => { return `${values.title.toLowerCase().replace(/\W+/g, '-')}` }
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
              validate: (value, data)=>{
                const lengthOfTitle = value?.length || 0
                if(lengthOfTitle < 3){
                  return 'A Title must be at least 3 characters long'
                }
                if(lengthOfTitle > 100){
                  return 'A Title must be at most 100 characters long'
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
              dateFormat: 'DD/MM/YYYY hh:mm A ZZ'
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
        ],
      }
    ],
  },
});
