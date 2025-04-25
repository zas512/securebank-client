"use client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "@/redux/store";
import type { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <Toaster />
      {children}
    </Provider>
  );
};

export default Providers;
