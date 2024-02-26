import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import UserLayout from "./(components)/UserLayout";
import Feed from "./(components)/Feed";
import { useSelector } from "react-redux";
import HomeContent from "./(components)/HomeContent";

const Home = async () => {
  // const session = await getServerSession(options);
  

  return (
    <HomeContent />
  )
};

export default Home;
