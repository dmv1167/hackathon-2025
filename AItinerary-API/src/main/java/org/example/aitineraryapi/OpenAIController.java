package org.example.aitineraryapi;


import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.ai.openai.api.ResponseFormat;
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

        record Places(
                @JsonProperty(required = true, value = "placeList") Place[] placeList,
                @JsonProperty(required = true, value = "startLocation") Place startLocation) {

            record Place(
                    @JsonProperty(required = true, value = "name") String name,
                    @JsonProperty(required = true, value = "information") String information,
                    @JsonProperty(required = true, value = "address") String address,
                    @JsonProperty(required = true, value = "latitude") double latitude,
                    @JsonProperty(required = true, value = "longitude") double longitude) {
            }
        }

        BeanOutputConverter<Places> outputConverter = new BeanOutputConverter<>(Places.class);

        String jsonSchema = outputConverter.getJsonSchema();

        String sysMessage = "You are a trip planning bot, respond to the request with locations in their area from the web. Include a start location estimate based on the location they specify.";
        PromptTemplate promptTemplate = new PromptTemplate(prompt.getPrompt());
        Message message = promptTemplate.createMessage();

        SystemPromptTemplate systemPromptTemplate = new SystemPromptTemplate(sysMessage);
        Message systemMessage = systemPromptTemplate.createMessage();
        Prompt finalPrompt = new Prompt(List.of(systemMessage, message),
                OpenAiChatOptions.builder()
                    .model(OpenAiApi.ChatModel.GPT_4_O_MINI)
                    .responseFormat(new ResponseFormat(ResponseFormat.Type.JSON_SCHEMA, jsonSchema))
                    .build()

        );
        return new ResponseEntity<>(new AiResponse(
                this.chatModel.call(finalPrompt).getResult().getOutput().getText()
        ), HttpStatus.OK);

    }
}
