# AI-Driven Risk Prediction Engine for Diabetes Patients

This project is a prototype of an AI-driven risk prediction engine designed to identify chronic care patients at risk of diabetes. It was developed as a submission for the Welldoc Hackathon.

The core of this project is a highly accurate and **explainable XGBoost model** that analyzes patient demographic and clinical data to predict a patient's diabetes status. The entire solution is built within a modular `scikit-learn` pipeline and served via a Python API, ensuring reproducibility and easy deployment for our Next.js dashboard.

### Dashboard Prototype

This is a conceptual preview of how the model's outputs would be displayed in a clinician-friendly dashboard. The dashboard provides a **cohort view** with individual risk scores, allowing care teams to prioritize patients who need immediate attention.

![Dashboard Prototype](https://github.com/Pranaykarvi/welldoc_hackathon/blob/main/prediction%20model%20engine/dashboard.jpg)

---

## The Challenge: Problem Statement

> **Title: AI-Driven Risk Prediction Engine for Chronic Care Patients**
>
> **Background:** Chronic conditions such as diabetes, obesity, and heart failure require continuous monitoring and proactive care. Despite access to vitals, lab results, and medication adherence data, predicting when a patient may deteriorate remains a major challenge. A reliable and explainable AI-driven solution could empower clinicians and care teams to intervene earlier, improve health outcomes, and reduce hospitalization risks.
>
> **Your Challenge:** Design and prototype an AI-driven Risk Prediction Engine that forecasts whether a chronic care patient is at risk of deterioration in the next 90 days. Your solution should leverage patient data and provide predictions in a way that is clinician-friendly, explainable, and actionable.

---

## Our Solution & Strategy

While the problem statement requires a 90-day forecast (requiring longitudinal data), we were provided with a cross-sectional dataset. Our strategy was to build a powerful **foundational prototype** that solves a critical, related problem: **"Predicting a patient's *current* diabetes risk based on their latest health metrics."**

This robust model serves as the core engine. It demonstrates our ability to handle complex health data, build a high-performing model, and—most importantly—provide **clinician-friendly explanations**, which was a key requirement. This engine can be readily adapted for predictive forecasting once longitudinal data becomes available.

### Tech Stack

* **Frontend:** Next.js, TypeScript, Tailwind CSS
* **Backend & ML:** Python, Flask, Pandas, Scikit-learn, XGBoost
* **Model Explainability:** SHAP (SHapley Additive exPlanations)
* **Visualization:** Matplotlib, Seaborn

---

## The Machine Learning Pipeline

Our solution is built as a single, cohesive pipeline that handles everything from raw data to final prediction. This ensures that the same processing steps are applied consistently during both training and inference.

### 1. Exploratory Data Analysis (EDA)

We began by analyzing the dataset to understand the relationships between different features and the prevalence of diabetes.

* **Key Insight:** We discovered a significant class imbalance, with far fewer diabetic patients than non-diabetic ones. This informed our decision to use `scale_pos_weight` in our model to prevent bias.
* **Correlations:** As expected, features like `HbA1c_level`, `blood_glucose_level`, `bmi`, and `age` showed strong correlations with the diabetes outcome.

![Diabetes Distribution]([images/diabetes_distribution.png](https://github.com/Pranaykarvi/welldoc_hackathon/blob/main/prediction%20model%20engine/diabetes_distribution.png))

### 2. Data Preprocessing

The `ColumnTransformer` is the heart of our preprocessing pipeline. It automatically applies the correct transformation to each type of column:
* **Numerical Features** (`age`, `bmi`, `HbA1c_level`): Scaled using `StandardScaler` to normalize the data, which helps the model converge effectively.
* **Categorical Features** (`gender`, `smoking_history`): Encoded using `OneHotEncoder` to convert text categories into a numerical format that the model can understand.

### 3. Model Architecture: XGBoost

We chose the **XGBoost (Extreme Gradient Boosting)** algorithm as our model.
* **Why XGBoost?** It's renowned for its high performance, speed, and ability to capture complex non-linear relationships in data. It consistently wins machine learning competitions and is perfect for a hackathon setting where performance is key.
* **Handling Imbalance:** We configured the model with the `scale_pos_weight` parameter, calculated based on the ratio of negative to positive classes. This forces the model to pay more attention to the minority class (diabetic patients), which is critical for reducing false negatives in a medical context.

---

## Model Performance & Evaluation

The model's performance was evaluated using a suite of industry-standard metrics to provide a comprehensive and trustworthy assessment. The model achieved an impressive **overall accuracy of 96.14%** on the test set.

### Confusion Matrix

The confusion matrix gives us a clear view of the model's classification performance. Our model correctly identified **1,601 non-diabetic** patients and **1,526 diabetic** patients, showing a strong balance. Critically, the number of **False Negatives (84)**—patients with diabetes who were missed—is low, which is a primary goal in a clinical application.

![Confusion Matrix](https://github.com/Pranaykarvi/welldoc_hackathon/blob/main/prediction%20model%20engine/confusion_matrix.png)

### AUROC and AUPRC

These metrics are essential for evaluating a classifier, especially on imbalanced data.
* **AUROC (Area Under the Receiver Operating Characteristic Curve):** Our model achieved an **AUROC of 0.97**. This score indicates that the model has an excellent ability to distinguish between a random diabetic and a random non-diabetic patient.
* **AUPRC (Area Under the Precision-Recall Curve):** We achieved an **AUPRC of 0.91**. This high score is particularly important because it shows the model maintains high precision even as it correctly identifies a high percentage of all positive (diabetic) cases.

| ROC Curve                                  | Precision-Recall Curve                                     |
| :----------------------------------------- | :--------------------------------------------------------- |
| ![ROC Curve](https://github.com/Pranaykarvi/welldoc_hackathon/blob/main/prediction%20model%20engine/roc_curve.png) | ![Precision-Recall Curve](https://github.com/Pranaykarvi/welldoc_hackathon/blob/main/prediction%20model%20engine/precision_recall_curve.png) |

---

## Model Explainability (XAI): Clinician-Friendly Insights

A "black box" model is useless in a clinical setting. To meet the hackathon's key requirement, we integrated **SHAP (SHapley Additive exPlanations)** to make our model's decisions transparent and actionable for clinicians.

### Global Explanations: What Factors Matter Most?

The SHAP summary plot shows the most influential factors across all patients. As expected, **`HbA1c_level`** and **`blood_glucose_level`** are the most significant predictors, followed by `age` and `bmi`. This confirms that our model has learned the correct, clinically relevant patterns from the data.

![Global Feature Importance](https://github.com/Pranaykarvi/welldoc_hackathon/blob/main/prediction%20model%20engine/shap_global_importance.png)

### Local Explanations: Why is a Specific Patient High-Risk?

This is the most powerful feature for a clinician. We can generate a "force plot" for any single patient to explain *why* the model assigned them their specific risk score.

**Example for a High-Risk Patient:**
> "Doctor, this patient was flagged as high-risk primarily because of their **high blood glucose level (pushing risk higher ↑)** and their **high HbA1c level (also pushing risk higher ↑)**. While their age is a contributing factor, the lab results are the main drivers for this prediction."

This level of detail allows for personalized interventions and builds trust in the AI system.
