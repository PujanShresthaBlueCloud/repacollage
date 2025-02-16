const { PrismaClient } = require("@prisma/client");

// Connecting database from prisma
const database = new PrismaClient();
async function main(){
    try{
        await database.category.createMany({
            data: [
                { name: "Computer Science "},
                { name: "Music Science "},
                { name: "Fittness Science "},
                { name: "Photography Science "},
                { name: "Accounting Science "},
                { name: "Filming Science "},
                { name: "Engineering Science "},
            ]
        });
        console.log("Success seeding");
    } catch (error) {
        console.log("Error while seeding the database categories: ", error)

    }finally {
        await database.$disconnect()
    }
}

main();