package org.example.aitineraryapi;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AiPrompt {
    @JsonProperty("prompt") private String prompt;

    public AiPrompt(@JsonProperty("prompt") String prompt) {
        this.prompt = prompt;
    }

    public String getPrompt() {
        return prompt;
    }
}
