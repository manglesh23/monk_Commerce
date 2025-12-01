import express from "express";
import { getTheCandidateAge } from "../controllers/ageGuessAPI.js";


 // ---------------------------------------------
  // AUTH ROUTES
  // ---------------------------------------------
const guessAgerouter = express.Router();
console.log("guess age routes");
guessAgerouter.get("/guessAge", getTheCandidateAge);


export default guessAgerouter;