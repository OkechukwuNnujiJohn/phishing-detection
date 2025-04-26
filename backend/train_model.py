from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
import joblib
import numpy as np

X = np.random.rand(1000, 5)
y = np.random.choice([0, 1], size=1000)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = DecisionTreeClassifier()
model.fit(X_train, y_train)

joblib.dump(model, 'phishing_model.pkl')
