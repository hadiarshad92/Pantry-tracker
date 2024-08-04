"use client";
import Image from "next/image";
// import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  Stack,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { Istok_Web } from "next/font/google";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });

    setInventory(inventoryList);
  };

  const addItem = async (name, quantity) => {
    const docRef = doc(collection(firestore, "pantry"), name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity: currentQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: currentQuantity + quantity });
    } else {
      await setDoc(docRef, { quantity: quantity });
    }

    await updateInventory();
  };

  const removeItem = async (name) => {
    const docRef = doc(collection(firestore, "pantry"), name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddItem = () => {
    addItem(itemName, itemQuantity);
    setItemName("");
    setItemQuantity(1);
    handleClose();
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      gap={2}
      sx={{ backgroundColor: "#FEFAE0" }} // Light blue background
    >
      <Box
        width="100%"
        bgcolor="#CCD5AE" // Royal blue background for the header
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding={2}
      >
        <Typography variant="h2" color="black">
          Inventory Management
        </Typography>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%,-50%)" }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <TextField
              label="Quantity"
              variant="outlined"
              type="number"
              fullWidth
              value={itemQuantity}
              onChange={(e) => {
                setItemQuantity(Number(e.target.value));
              }}
            />
            <Button variant="outlined" onClick={handleAddItem}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        sx={{ marginTop: 2 }}
      >
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ height: "56px", backgroundColor: "#4169e1", color: "white" }} // Royal blue button
        >
          Add New Item
        </Button>
        <TextField
          label="Search Items"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "200px", height: "56px", backgroundColor: "white" }}
        />
      </Stack>
      <Box
        border="1px solid #333"
        sx={{
          width: "950px",
          backgroundColor: "#f0f8ff", // Light blue background
          marginTop: 2,
        }}
      >
        <Box
          height="50px"
          bgcolor="#add8e6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h4" color="#333">
            Inventory Items
          </Typography>
        </Box>

        <Stack
          height="400px"
          width="950px"
          spacing={2}
          overflow="auto"
          padding={2}
        >
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="10px"
              display="grid"
              gridTemplateColumns="2fr 1fr 3fr"
              alignItems="center"
              bgcolor="white"
              padding={2}
              borderBottom="1px solid #ddd"
            >
              <Typography variant="h6" color="#333" textAlign="left">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(name, 1);
                  }}
                  sx={{ backgroundColor: "#4169e1", color: "white" }} // Royal blue button
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    removeItem(name);
                  }}
                  sx={{ backgroundColor: "#4169e1", color: "white" }} // Royal blue button
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
