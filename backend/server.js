import express from 'express'
import dotenv from 'dotenv';
import { connectDatabase } from './databaseConnection/databaseConnection.js';
import router from './routes/authRoutes.js';
import productRoute from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRoute from './routes/orderRouters.js';
import couponRoute from './routes/couponRoutes.js';
import { slidingRateLimiter } from './middlewares/rateLimiter.js';
import guessAgerouter from './routes/apiIntegrationRoutes.js';
import cors from 'cors'
dotenv.config();

const app= express();
app.use(express.json());
app.use(cors())

 // ---------------------------------------------
  // ROUTES FOR AUTH, PRODUCT, CART, ORDER, COUPON
  // ---------------------------------------------
app.use(slidingRateLimiter);  
app.use("/api/auth",router );
app.use("/api/products",productRoute);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRoute);
app.use("/api/coupon",couponRoute);
app.use("/api/inte",guessAgerouter);

 // ---------------------------------------------
  // PORT:8000
  // ---------------------------------------------
connectDatabase()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`listening at ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });