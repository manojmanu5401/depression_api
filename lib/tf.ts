import * as tf from "@tensorflow/tfjs";

let model: any;

const class_names = [
  [
    "Normal",
    "Mild Depression",
    "Moderate Depression",
    "Severe Depression",
    "Extremely Severe Depression",
  ],
  ["Non-depressed", "Depressed"],
];

export const loadModel = async (url: string) => {
  model = await tf.loadGraphModel(url);
  return model;
};

export const predict = async (input: any, type: number) => {
  try {
    console.log(input)
    let tensor = tf.tensor2d(input, [1, input.length])
    console.log(tensor)
    // console.log(tensor.dataSync());

    let pred_probs = await model.predict(tensor);
    let pred = pred_probs.dataSync();

    if (type === 0) {
      pred = tf.tensor1d(pred).argMax().dataSync();
    } else if (type === 1) {
      pred = tf.tensor1d(pred).sigmoid().dataSync();
      if (pred > 0.5) {
        pred = 1;
      } else {
        pred = 0;
      }
    }
    
    // @ts-ignore
    return { class: class_names[type][pred], pred };
  } catch (error: any) {
    console.log({ERROR: error.message});
  }
};
