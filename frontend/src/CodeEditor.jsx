import React, { useState } from "react";
import axios from "axios";
import {
  Grid,
  Paper,
  Select,
  MenuItem,
  Button,
  TextareaAutosize,
} from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import * as monaco from "monaco-editor";

const theme = createTheme();

export const CodeEditor = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [convertedCode, setConvertedCode] = useState("");

  const editorRef = React.useRef(null);

  React.useEffect(() => {
    editorRef.current = monaco.editor.create(
      document.getElementById("editor"),
      {
        language: "javascript",
        theme: "vs-dark",
      }
    );
  }, []);

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleConvert = async () => {
    try {
      const code = editorRef.current.getValue();

      const response = await axios.post("/convert", {
        code,
        targetLanguage: selectedLanguage,
      });
      setConvertedCode(response.data.convertedCode);
    } catch (error) {
      console.error("Error during code conversion:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                variant="outlined"
              >
                <MenuItem value="python">Python</MenuItem>
                <MenuItem value="javascript">JavaScript</MenuItem>
                {/* Add more language options */}
              </Select>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConvert}
              >
                Convert
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ height: "400px", padding: "10px" }}>
            <div id="editor" style={{ height: "100%" }} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ height: "400px", padding: "10px" }}>
            <TextareaAutosize
              value={convertedCode}
              readOnly
              style={{ width: "100%", height: "100%", resize: "none" }}
            />
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
