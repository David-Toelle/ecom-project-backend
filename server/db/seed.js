const axios = require("axios");
const {prisma} = require("../shared/shared");
async function main() {
    console.log("seeding...");
  try {
    // Clear existing products
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    const response = await axios.get("https://fakestoreapi.com/products");
    const products = response.data;
    console.log(products);
    for (const product of products) {
      console.log("TITLE", product.title);
      await prisma.product.create({
        data: {
          title: product.title,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
        },
      });
    }
    await prisma.user.createMany({
      data: [
        {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "password123", // You should hash passwords in a real application
        },
        {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          password: "password456", // Hash passwords in a real application
        },
        // Add more default users as needed
      ],
    });
    console.log("Default users created successfully.");
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // await prisma.$disconnect();
    console.log("Disconnected")
  });