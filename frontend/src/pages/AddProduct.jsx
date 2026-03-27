import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useUserStore } from "../store/useUserStore";

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useProductStore();
  const { currentUser } = useUserStore();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
};

export default AddProduct;