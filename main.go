package main

import (
	"bufio"
	"embed"
	"fmt"
	"net"
	"net/http"
	
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
)

//go:embed index.html README-ASS.md modals.js
var content embed.FS

const assetsDir = "enidu-assets"
const htmlFile = "index.html"

func extractHTMLIfNeeded() error {
    // Check if assetsDir exists, if not, create it
    if _, err := os.Stat(assetsDir); os.IsNotExist(err) {
        if err := os.Mkdir(assetsDir, 0755); err != nil {
            return err
        }
    }
    // Check if index.html exists in assetsDir
    htmlPath := filepath.Join(assetsDir, htmlFile)
    if _, err := os.Stat(htmlPath); os.IsNotExist(err) {
        // Extract from embed
        data, err := content.ReadFile(htmlFile)
        if err != nil {
            return err
        }
        if err := os.WriteFile(htmlPath, data, 0644); err != nil {
            return err
        }
    }
    // Replicate README.md if it exists in the embed
    readmePath := filepath.Join(assetsDir, "README.md")
    if _, err := os.Stat(readmePath); os.IsNotExist(err) {
        data, err := content.ReadFile("README-ASS.md")
        if err == nil {
            _ = os.WriteFile(readmePath, data, 0644)
        }
        // If README.md is not embedded, just skip (do not error)
    }
    // Replicate modals.js if it exists in the embed
    modalsPath := filepath.Join(assetsDir, "modals.js")
    if _, err := os.Stat(modalsPath); os.IsNotExist(err) {
        data, err := content.ReadFile("modals.js")
        if err == nil {
            _ = os.WriteFile(modalsPath, data, 0644)
        }
        // If modals.js is not embedded, just skip (do not error)
    }
    return nil
}

func openBrowser(url string) {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
	case "darwin":
		cmd = exec.Command("open", url)
	default:
		cmd = exec.Command("xdg-open", url)
	}
	if err := cmd.Start(); err != nil {
		fmt.Println("Failed to open browser:", err)
	}
}

func main() {
	port := GetContainerPort()
    createdAssets := false
    // Extract index.html to assetsDir if needed
    if _, err := os.Stat(filepath.Join(assetsDir, htmlFile)); os.IsNotExist(err) {
        createdAssets = true
    }
    url := "http://localhost:" + port + "/index.html?nadhi.dev=v1&compilation=go&platform=" + runtime.GOOS + "&port=" + port + "&loader=HTML&createdAssets=" + strconv.FormatBool(createdAssets)

	// Extract index.html to assetsDir if needed
	if err := extractHTMLIfNeeded(); err != nil {
		fmt.Println("Failed to extract index.html:", err)
		return
	}

	// Serve from assetsDir if index.html exists there
	htmlPath := filepath.Join(assetsDir, htmlFile)
	var fs http.Handler
	if _, err := os.Stat(htmlPath); err == nil {
		fs = http.FileServer(http.Dir(assetsDir))
	} else {
		fs = http.FileServer(http.FS(content))
	}
	http.Handle("/", fs)

   
    footer(url)
   
    
	go func() {
		openBrowser(url)
	}()
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		panic(err)
	}
}

func GetContainerPort() string {
	// 1. Check for a file ending with .port.debug
	files, _ := filepath.Glob("*.port.debug")
	if len(files) > 0 {
		f, err := os.Open(files[0])
		if err == nil {
			defer f.Close()
			scanner := bufio.NewScanner(f)
			if scanner.Scan() {
				port := strings.TrimSpace(scanner.Text())
				if port != "" {
					return port
				}
			}
		}
	}

	// In testing make it load the port from .env
	// This is useful for local development
	if _, err := os.Stat(".env"); err == nil {
		f, err := os.Open(".env")
		if err == nil {
			defer f.Close()
			scanner := bufio.NewScanner(f)
			for scanner.Scan() {
				line := scanner.Text()
				if strings.HasPrefix(line, "PORT=") {
					os.Setenv("PORT", strings.TrimSpace(strings.TrimPrefix(line, "PORT=")))
				}
			}
		}
	}
	port := os.Getenv("PORT")
	if port == "" {
		// 3. fallback: find a free port
		l, err := net.Listen("tcp", ":0")
		if err != nil {
			port = "8080"
		} else {
			defer l.Close()
			port = strconv.Itoa(l.Addr().(*net.TCPAddr).Port)
		}
	}
	// 4. Create debug file
	// removed this cuz it's stupid
	debugFile := fmt.Sprintf("port-%s.debug", port)
	_ = os.WriteFile(debugFile, []byte(port), 0644)
	return port
}

func footer(url string) {
    fmt.Println("   _____       _     _       ")
    fmt.Println("  | ____|_ __ (_) __| |_   _ ")
    fmt.Println("  |  _| | '_ \\| |/ _` | | | | The powerhouse")
    fmt.Println("  | |___| | | | | (_| | |_| | of stressing")
    fmt.Println("  |_____|_| |_|_|\\__,_|\\__,_| websites")
    fmt.Println()

    fmt.Println("╔══════════════════════════════════════════════════════════════════════╗")
    // working the back spaces and etc for this bullshit took a lot of time
	fmt.Printf("║ Starting Enidu Desktop for %-36s      ║\n", strings.Title(runtime.GOOS))
    fmt.Println("║ Copyright Nadhi.dev (2025-present)                                   ║")
    fmt.Println("║ Enidu is made for educational and personal use only!                 ║")
    fmt.Println("╠══════════════════════════════════════════════════════════════════════╣")
    fmt.Println("║ ⚠️. Nadhi.dev is not responsible for any illegal use of this software ║")
    fmt.Println("╚══════════════════════════════════════════════════════════════════════╝")
    fmt.Println("Serving app at:", url)

}