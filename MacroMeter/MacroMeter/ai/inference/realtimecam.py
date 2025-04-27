#!/usr/bin/env python3
"""
webcam_macro_ui.py:  
  Opens a simple Tkinter GUI that:
    - Shows a live webcam preview
    - Prompts for dish weight in grams
    - Captures the current frame on button press
    - Calls calculate_dish_macros() from dish_macro_calculator.py
    - Displays the resulting JSON in the text box
    - Saves the output to dish_macros.json
    - Allows dynamic resizing without clipping
"""

import os
import tempfile
import json
import cv2
import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk

# Import the function you already have
from mainCam import calculate_dish_macros

class MacroApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Dish Macro Calculator (Live Webcam)")
        # Set initial size and allow window to be resized
        self.root.geometry('800x600')
        self.root.minsize(400, 300)
        self.root.resizable(True, True)

        # Initialize webcam
        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            messagebox.showerror("Camera Error", "Could not open webcam.")
            root.destroy()
            return

        # Last captured frame storage
        self.last_frame = None

        # Build UI
        self._build_ui()

        # Start the video loop
        self._update_frame()

    def _build_ui(self):
        # Configure grid weights for resizing
        self.root.columnconfigure(0, weight=1)
        self.root.columnconfigure(1, weight=1)
        self.root.rowconfigure(0, weight=3)  # video
        self.root.rowconfigure(1, weight=0)  # weight input
        self.root.rowconfigure(2, weight=0)  # button
        self.root.rowconfigure(3, weight=2)  # output

        # Video preview label
        self.video_label = ttk.Label(self.root)
        self.video_label.grid(row=0, column=0, columnspan=2, sticky="NSEW", padx=5, pady=5)

        # Weight input
        ttk.Label(self.root, text="Weight (g):").grid(row=1, column=0, sticky="E", padx=5)
        self.weight_entry = ttk.Entry(self.root)
        self.weight_entry.grid(row=1, column=1, sticky="W", padx=5)
        self.weight_entry.insert(0, "750")  # default

        # Capture button
        self.capture_btn = ttk.Button(
            self.root,
            text="Capture & Calculate",
            command=self.capture_and_calculate
        )
        self.capture_btn.grid(row=2, column=0, columnspan=2, pady=(5, 5))

        # Output text area inside a frame for scrollbars
        output_frame = ttk.Frame(self.root)
        output_frame.grid(row=3, column=0, columnspan=2, sticky="NSEW", padx=5, pady=5)
        output_frame.columnconfigure(0, weight=1)
        output_frame.rowconfigure(0, weight=1)

        self.output_text = tk.Text(output_frame)
        self.output_text.grid(row=0, column=0, sticky="NSEW")

        # Add scrollbar
        scrollbar = ttk.Scrollbar(output_frame, orient=tk.VERTICAL, command=self.output_text.yview)
        scrollbar.grid(row=0, column=1, sticky="NS")
        self.output_text['yscrollcommand'] = scrollbar.set

    def _update_frame(self):
        # Read frame
        ret, frame = self.cap.read()
        if ret:
            # Store for capture
            self.last_frame = frame.copy()
            # Convert BGR to RGB
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(rgb)

            # Resize preview to fit label
            label_w = self.video_label.winfo_width()
            label_h = self.video_label.winfo_height()
            if label_w > 0 and label_h > 0:
                # Use LANCZOS for high-quality downsampling
                img = img.resize((label_w, label_h), Image.LANCZOS)

            imgtk = ImageTk.PhotoImage(image=img)
            self.video_label.imgtk = imgtk
            self.video_label.configure(image=imgtk)

        # Schedule next frame
        self.root.after(30, self._update_frame)

    def capture_and_calculate(self):
        # 1. Read and validate weight
        weight_str = self.weight_entry.get()
        try:
            weight = float(weight_str)
        except ValueError:
            messagebox.showerror("Invalid Weight", "Please enter a valid number for grams.")
            return

        # 2. Ensure we have a frame
        if self.last_frame is None:
            messagebox.showerror("Capture Error", "No frame available from webcam.")
            return

        # 3. Save the last frame to a temp file
        tmp_path = os.path.join(tempfile.gettempdir(), "dish_capture.jpg")
        cv2.imwrite(tmp_path, self.last_frame)

        # 4. Call your existing macro calculator
        dish_name, macros = calculate_dish_macros(tmp_path, weight)

        # 5. Build JSON result
        result = {
            "DishName": dish_name,
            "Weight_g": weight,
            "Macros": {
                "calories": round(macros["calories"], 2),
                "protein_g": round(macros["protein_g"], 2),
                "carbs_g": round(macros["carbs_g"], 2),
                "fat_g": round(macros["fat_g"], 2),
            },
        }

        # 6. Display it
        self.output_text.delete("1.0", tk.END)
        self.output_text.insert(tk.END, json.dumps(result, indent=2))

        # 7. Save to JSON file
        try:
            with open('dish_macros.json', 'w') as f:
                json.dump(result, f, indent=2)
            print("dish_macros.json updated")
        except Exception as e:
            messagebox.showerror("File Error", f"Could not save JSON: {e}")

    def __del__(self):
        # Release camera on exit
        if hasattr(self, 'cap') and self.cap.isOpened():
            self.cap.release()

if __name__ == "__main__":
    root = tk.Tk()
    app = MacroApp(root)
    root.mainloop()
