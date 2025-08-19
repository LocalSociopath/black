import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";

const app = express();
const upload = multer({ dest: "temp_chunks/" });

// Serve frontend files
app.use(express.static("public"));

// Handle chunk upload
app.post("/upload-chunk", upload.single("chunk"), (req, res) => {
    const { fileName, index, totalChunks } = req.body;
    const chunkPath = req.file.path;
    const finalPath = path.join("uploads", fileName);

    // Append chunk to final file
    const data = fs.readFileSync(chunkPath);
    fs.appendFileSync(finalPath, data);
    fs.unlinkSync(chunkPath); // delete temp chunk

    if (parseInt(index) + 1 === parseInt(totalChunks)) {
        console.log(`File ${fileName} fully uploaded!`);
    }

    res.send("Chunk received");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
