# Bricc'd - The Ultimate Lego Studio Prototype

Bricc'd is a high-performance, web-based 3D brick building application. Built with **Vanilla JS**, **Three.js**, and **Vite**, it offers a seamless, private creative experience from desktop to VR.

## 🚀 Quickstart Guide

### 1. Setup
```bash
# Clone the repository
git clone https://github.com/your-repo/briccd.git
cd briccd

# Install dependencies
npm install
```

### 2. Local Development
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 🛠 Features

- **3D Brick Engine**: Real-time grid snapping, lifting, and dropping of various brick types.
- **Local Persistence**: Save your creations directly to your browser's `localStorage`. No account or internet connection required.
- **Custom LEGO Avatar**: Personalize your builder with custom colors and face types (Classic, Cool, Surprised, Wink).
- **Meta AR/VR Ready**: Full **WebXR** support. Click the "Enter VR" button on compatible devices (Quest 2/3/Pro) to build in immersive 3D.
- **Shortcuts**: 
  - `Ctrl/Cmd + Click`: Duplicate the selected piece.
  - `Rotate Button`: Rotate pieces on the horizontal plane.
  - `D-Pad`: Touchscreen-friendly directional movement controls.

---

## 🔐 Privacy & Security

- **100% Local**: Your designs never leave your device. Bricc'd uses browser storage for all data.
- **No Tracking**: No cookies, no trackers, no analytics.
- **Sanitized Repository**: All development artifacts and temporary files are excluded via `.gitignore`.

---

## 🌐 Deployment (Cloudflare Pages)

Bricc'd is optimized for Cloudflare Pages.

1. Connect your GitHub repository to Cloudflare Pages.
2. Set the **Build Command** to `npm run build`.
3. Set the **Output Directory** to `dist`.
4. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the Environment Variables in the Cloudflare dashboard.

---

## 🕶 AR/VR Compatibility

To view in AR/VR:
1. Access the site via an HTTPS connection (required for WebXR).
2. Use a compatible browser (e.g., Oculus Browser on Meta Quest).
3. Click the **ENTER VR** button at the bottom of the screen.

---

## 📖 Use Cases

### For Casual Builders
Create quick models and save them locally. No account required for local storage!

### For Educators
Demonstrate 3D spatial reasoning and geometry in a fun, interactive environment.

### For VR Enthusiasts
Experience the scale of your creations by walking around them in a virtual workspace.

---

*Made with 🧱 by Gemini CLI*
