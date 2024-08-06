"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  Stack,
  TextField,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

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
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      gap={2}
      sx={{ backgroundColor: "#FEFAE0" }}
    >
      <Box
        width="100%"
        bgcolor="#CCD5AE"
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding={2}
      >
        <Typography variant={isSmallScreen ? "h4" : "h2"} color="black">
          Inventory Management
        </Typography>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={isSmallScreen ? "90%" : isMediumScreen ? 400 : 600}
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
            <Button
              variant="outlined"
              onClick={handleAddItem}
              sx={{ width: isSmallScreen ? "100%" : "auto" }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack
        direction={isSmallScreen ? "column" : "row"}
        spacing={isSmallScreen ? 2 : 3}
        alignItems="center"
        sx={{ marginTop: 2 }}
        width="100%"
        justifyContent="center"
      >
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            height: isSmallScreen ? "40px" : "56px",
            width: isSmallScreen ? "80%" : isMediumScreen ? "200px" : "auto",
            backgroundColor: "#4169e1",
            color: "white",
            fontSize: isSmallScreen ? "0.8rem" : "1rem",
          }}
        >
          Add New Item
        </Button>
        <TextField
          label="Search Items"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: isSmallScreen ? "80%" : isMediumScreen ? "300px" : "200px",
            height: isSmallScreen ? "40px" : "56px",
            backgroundColor: "white",
          }}
        />
      </Stack>
      <Box
        border="1px solid #333"
        sx={{
          width: isSmallScreen ? "90%" : isMediumScreen ? "80%" : "950px",
          backgroundColor: "#f0f8ff",
          marginTop: 2,
          maxHeight: "400px", // Fixed height for inventory items
          overflowY: "auto", // Enable vertical scrolling
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

        <Stack spacing={2} padding={2}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="10px"
              display="flex"
              flexDirection={isSmallScreen ? "column" : "row"}
              alignItems="center"
              bgcolor="white"
              padding={2}
              borderBottom="1px solid #ddd"
              sx={{ textAlign: isSmallScreen ? "center" : "left" }}
            >
              <Typography
                variant="h6"
                color="#333"
                flex={isSmallScreen ? "1 0 auto" : "2"}
                sx={{
                  marginBottom: isSmallScreen ? "8px" : "0",
                }}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h6"
                color="#333"
                flex={isSmallScreen ? "1 0 auto" : "1"}
                sx={{
                  marginBottom: isSmallScreen ? "8px" : "0",
                }}
              >
                {quantity}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                justifyContent={isSmallScreen ? "center" : "flex-end"}
                flex={isSmallScreen ? "1 0 auto" : "3"}
                sx={{
                  flexWrap: isSmallScreen ? "wrap" : "nowrap",
                  gap: isSmallScreen ? "4px" : "8px",
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(name, 1);
                  }}
                  sx={{
                    backgroundColor: "#4169e1",
                    color: "white",
                    width: isSmallScreen ? "80px" : "auto",
                    fontSize: isSmallScreen ? "0.7rem" : "1rem",
                    padding: isSmallScreen ? "4px 8px" : "auto",
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    removeItem(name);
                  }}
                  sx={{
                    backgroundColor: "#4169e1",
                    color: "white",
                    width: isSmallScreen ? "80px" : "auto",
                    fontSize: isSmallScreen ? "0.7rem" : "1rem",
                    padding: isSmallScreen ? "4px 8px" : "auto",
                  }}
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
