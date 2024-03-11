"use client";

import UserLayout from "@/components/UserLayout";
import { SUBSCRIPTION_PLANS } from "@/constants";
import { selectUser } from "@/redux/selectors";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import React from "react";


const SubscriptionPlan = ({ plan, handleSubscribe }) => (
  <div className="flex flex-col items-center border p-4">
    <div className="w-24 h-24 rounded-full bg-gray-400 flex justify-center items-center text-3xl uppercase">{plan.name[0]}</div>
    <h2 className="font-bold text-2xl my-4">{plan.name}</h2>
    <h3 className="font-semibold mb-2">
      ₹{plan.price}/{plan.type}
    </h3>
    <p className="max-w-96 text-gray-600 text-justify ">{plan.description}</p>
    <button
      className={`px-3 py-2 bg-blue-500 mt-4 rounded-md`}
      onClick={() => handleSubscribe(plan)}
    >
      Subscribe
    </button>
  </div>
);

const SubscriptionPage = () => {
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);
  const { user } = useSelector(selectUser(userInfo?._id));

  // Handle Subscription
  const handleSubscribe = (plan) => {
    fetch("http://localhost:3300/api/v1/stripe/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ id: plan.id, quantity: 1 }],
        userId: user._id,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        router.push(url);
      })
      .catch((error) => {
        console.error(error.error);
      });
  };

  return (
    <UserLayout>
      <div className="p-4 ml-36 w-5/6 flex justify-center">
        <div className="flex gap-4 shadow-md max-w-fit p-4">
          {user?.bluetick.status ? (
            <SubscribedPlan user={user} />
          ) : (
            <AvailablePlans handleSubscribe={handleSubscribe} />
          )}
        </div>
      </div>
    </UserLayout>
  );
};

const SubscribedPlan = ({ user }) => {
  const USER_SUBSCRIPTION = SUBSCRIPTION_PLANS.find(
    (plan) => user?.bluetick.type === plan.type
  );

  return (
    <div className="flex flex-col items-center border p-4">
      <div className="w-24 h-24 rounded-full bg-gray-400 flex justify-center items-center text-3xl uppercase">{USER_SUBSCRIPTION.name[0]}</div>
      <h2 className="font-bold text-2xl my-4">{USER_SUBSCRIPTION.name}</h2>
      <h3 className="font-semibold mb-2">
        ₹{USER_SUBSCRIPTION.price}/{USER_SUBSCRIPTION.type}
      </h3>
      <p className="max-w-96 text-gray-600 text-justify ">
        {USER_SUBSCRIPTION.description}
      </p>
      <button
        className={`px-3 py-2 bg-blue-500 mt-4 rounded-md  cursor-not-allowed `}
        disabled
      >
        Subscribed
      </button>
    </div>
  );
};

const AvailablePlans = ({ handleSubscribe }) => (
  <>
    {SUBSCRIPTION_PLANS.map((plan) => (
      <SubscriptionPlan
        key={plan.id}
        plan={plan}
        handleSubscribe={handleSubscribe}
      />
    ))}
  </>
);

export default SubscriptionPage;
