This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Lesson:
https://www.youtube.com/watch?v=Big_aFLmekI&t=4193s

// For menu
npx shadcn-ui@latest add sheet -> this was not working so did the one below
npx shadcn@latest add sheet

// For form
npx shadcn@latest add form
npx shadcn@latest add input

// install axios
npm i axios

// toast element 
npm i react-hot-toast

// database schema installation
npm i -D prisma
also intall
npm instakk @prisma/client
npx prisma init // to initiate 
DATABASE_URL="mysql://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE_NAME>"
DATABASE_URL="mysql://root:password@localhost:3306/mydatabase"

npx prisma generate 
npx prisma db push

// to check the database
npx prisma studio

// making values available from the url we define [] in folder name such as 
[courseId] folder so that we ca get course id from url


// npx shadcn-ui@latest add textarea

## For uploading go to uploadthing.com and create account
in this we upload the image so using this service
https://docs.uploadthing.com/getting-started/appdir
for old one we using
https://v6.docs.uploadthing.com/
npm install uploadthing @uploadthing/react

# css for the uploadthing image we need to modify tailwind.config.js and also go to app/globals.css
when image upload issue then we need to add hostname in next.config.js file

# For the popover and combobox 
https://ui.shadcn.com/docs/components/combobox
need to install it for usage
https://ui.shadcn.com/docs/components/popover#installation
npx shadcn@latest add popover

also we need to install command
npx shadcn@latest add command
# repacollage for connecting database category we need seeding so create scripts folder in root and make seed.ts file inside
then we run file using
node scripts/seed.ts

#prisma schema to add model run
npx prisma generate
# also we have to do 
npx prisma db push

# Use this for reorder the list 
npm i @hello-pangea/dnd

# adding batch
npx shadcn@latest add badge

# install react quill
npm i react-quill

# check box from shadcn
npx shadcn@latest add checkbox

# For mux data
create account and check login details and get the token id and token secret

npm i @mux/mux-node
npm i @mux/mux-player-react


# now we need to add alert dialog
npx shadcn@latest add alert-dialog

# For the section of course publish and unpublish
npm i zustand
and again install
npm i react-confetti

## For data table 
https://ui.shadcn.com/docs/components/data-table
npx shadcn@latest add table
npm install @tanstack/react-table

we will render the data table inside the page course page which we just had kept the NEW COURSE button
add dropdown menu
npx shadcn@latest add dropdown-menu
