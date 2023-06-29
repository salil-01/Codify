import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Grid,
  Heading,
  Select,
  Textarea,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import * as monaco from "monaco-editor";

function CodeEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
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

  const textEditorBgColor = useColorModeValue("white", "gray.800");
  const outputBgColor = useColorModeValue("gray.100", "gray.700");
  const outputTextColor = useColorModeValue("black", "white");

  return (
    <Box p={4}>
      <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={4} alignItems="center">
        <Select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          variant="outline"
        >
          <option value="">Select Language</option>
          <option value="java">Java</option>
          <option value="C">C</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          {/* Add more language options */}
        </Select>
        <Button colorScheme="teal" onClick={handleConvert}>
          Convert
        </Button>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <Box p={4} borderWidth="1px" borderRadius="md" bg={textEditorBgColor}>
          <Heading size="md" mb={4} color={outputTextColor}>
            Input
          </Heading>
          <Box id="editor" height="400px" />
        </Box>
        <Box p={4} borderWidth="1px" borderRadius="md" bg={outputBgColor}>
          <Heading size="md" mb={4} color={outputTextColor}>
            Output
          </Heading>
          <Textarea
            value={convertedCode}
            readOnly
            h="400px"
            resize="none"
            bg={textEditorBgColor}
            color={outputTextColor}
          />
        </Box>
      </Grid>
    </Box>
  );
}

export default CodeEditor;
