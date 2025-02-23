package org.example.aitineraryapi;


import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;



@RestController
@RequestMapping("/aicall")
public class OpenAIController {

    private final OpenAiChatModel chatModel;

    public OpenAIController(OpenAiChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @PostMapping("")
    public ResponseEntity<AiResponse> submitPrompt(@RequestBody AiPrompt prompt) {
        String jsonSchema = """
        {
            "type": "object",
            "properties": {
                "steps": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "explanation": { "type": "string" },
                            "output": { "type": "string" }
                        },
                        "required": ["explanation", "output"],
                        "additionalProperties": false
                    }
                },
                "final_answer": { "type": "string" }
            },
            "required": ["steps", "final_answer"],
            "additionalProperties": false
        }
        """;

        String sysMessage = "You are a trip planning bot, respond to the request with locations in their area from the web";
        PromptTemplate promptTemplate = new PromptTemplate(prompt.getPrompt());
        Message message = promptTemplate.createMessage();

        SystemPromptTemplate systemPromptTemplate = new SystemPromptTemplate(sysMessage);
        Message systemMessage = systemPromptTemplate.createMessage();
        Prompt finalPrompt = new Prompt(List.of(systemMessage, message));
        return new ResponseEntity<>(new AiResponse(
                this.chatModel.call(finalPrompt).getResult().getOutput().getText()
        ), HttpStatus.OK);

    }
}
