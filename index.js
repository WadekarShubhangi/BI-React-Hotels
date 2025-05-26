const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
const { initializeDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotel.models");
initializeDatabase();


// const newHotel = {
//   name: "Radisson Blu Plaza",
//   location: "Mahipalpur, New Delhi",
//   rating: 4.5,
//   amenities: ["Free Wi-Fi", "Swimming Pool", "Spa", "Fitness Center", "Bar", "Airport Shuttle"],
//   phoneNumber: "+911145678900",
//   website: "https://radissonblu-example.com",
//   roomTypes: ["Standard Room", "Business Class Room", "Executive Suite"],
//   priceRange: "$$$ (31-60)",
//   isBookingAvailable: true,
//   photos: [
//     "https://example.com/radisson-photo1.jpg",
//     "https://example.com/radisson-photo2.jpg",
//     "https://example.com/radisson-photo3.jpg"
//   ]
// };

async function readAllHotels() {
  try {
    const hotels = await Hotel.find();
    return hotels;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels();
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No hotel found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

// 2. read hotel by its name
async function readHotelByName(name) {
  try {
    const hotel = await Hotel.findOne({ name: name });
    return hotel;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotel = await readHotelByName(req.params.hotelName);
    if (hotel) {
      res.send(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get hotels." });
  }
});

//3. red hotel by phone number
async function readHotelByPhoneNumber(number) {
  try {
    const hotel = await Hotel.findOne({ phoneNumber: number });
    return hotel;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/directory/:phoneNumber", async (req, res) => {
     try {
    const hotel = await readHotelByPhoneNumber(req.params.phoneNumber);
    if (hotel) {
      res.send(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get hotels." });
  }
})

// 4 read all hotels by rating
async function readHotelByRating(rating) {
  try {
    const hotel = await Hotel.findOne({ rating : rating });
    return hotel;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/rating/:hotelrating", async (req, res) => {
     try {
    const hotel = await readHotelByRating(req.params.hotelrating);
    if (hotel) {
      res.send(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get hotels." });
  }
})

// 5 Read hotel by category
async function readHotelByCategory(category) {
  try {
    const hotel = await Hotel.findOne({ category : category });
    return hotel;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/category/:hotelCategory", async (req, res) => {
     try {
    const hotel = await readHotelByCategory(req.params.hotelCategory);
    if (hotel) {
      res.send(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get hotels." });
  }
})



// Function to add new hotel
async function addNewHotel(newHotel) {
  try {
    const hotel = new Hotel(newHotel);
    const savedHotel = await hotel.save();
    console.log("New hotel's details:", savedHotel);
    return savedHotel;
  } catch (error) {
    throw error;
  }
}

// POST route to add new hotel
app.post("/hotels", async (req, res) => {
  try {
    const savedHotel = await addNewHotel(req.body);
    res.status(201).json({ message: "Hotel added successfully.", hotel: savedHotel });
  } catch (error) {
     console.error("Error adding hotel:", error);
    res.status(500).json({ error: "Failed to add Hotel." });
  }
});

// deleting
async function deleteHotel(hotelId) {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
    return deletedHotel;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotel(req.params.hotelId);
    if (deletedHotel) {
      res.status(200).json({ message: "Hotel deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Hotel." });
  }
});


// updating
async function updateHotel(hotelId, dataToUpdate) {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, {
      new: true,
    });
    return updatedHotel;
  } catch (error) {
    console.log("Error in updateing Hotel.", error);
  }
}

app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const updatedHotel = await updateHotel(req.params.hotelId, req.body);
    if (updatedHotel) {
      res
        .status(200)
        .json({
          message: "Hotel updated successfully.",
          updatedHotel: updatedHotel,
        });
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update Hotel." });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
