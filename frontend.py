import gradio
from transformers import AutoTokenizer, AutoModelWithLMHead

model_locus = "model-4-21-23"

tokenizer = AutoTokenizer.from_pretrained(model_locus)
model = AutoModelWithLMHead.from_pretrained(model_locus)

title = "geo-magi"
description = "First attempt at a GPT2 based model fine-tuned on geomagnetism text. Website made using Gradio."

def predict(prompt):
    capacity = 15
    generation_length = len(prompt.split()) * capacity * 2
    generation_text = tokenizer.encode(prompt, return_tensors='pt')

    response = model.generate(
        input_ids=generation_text, 
        max_length=generation_length, 
        do_sample=True, 
        early_stopping=True,
        num_beams=10,
        no_repeat_ngram_size=4,
        top_k=50, 
        typical_p=0.8,
        temperature=.8)

    response = tokenizer.decode(response[0], skip_special_tokens=True)
    response = response.replace("\n", "</EOL> ")
    
    if "</EOL>" in response:
        response = response.split("</EOL>")[0]

    return response

iface = gradio.Interface(
    fn=predict,
    inputs="text",
    outputs="text",
    title=title,
    description=description,
    examples=[["Magnetic declination is"], ["To correct my compass bearing, I need to know"], ["The World Magnetic Model is"]],
)

iface.launch()

