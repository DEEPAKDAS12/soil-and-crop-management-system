import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Farmer {
    String username;
    String password;

    Farmer(String username, String password) {
        this.username = username;
        this.password = password;
    }
}

public class CropSoilManagementSystemGUI extends JFrame {
    private static Map<String, Farmer> farmers = new HashMap<>();
    private static Map<Integer, String> soilTypeMap = new HashMap<>();
    private static Map<Integer, String> soilManagementTips = new HashMap<>();
    private static Map<String, CropHistory> farmerCropHistory = new HashMap<>();
    private static Map<String, String> fertilizerSuggestions = new HashMap<>();
    private static Map<String, String> pesticideSuggestions = new HashMap<>();
    private static Map<String, String> cropRotationSuggestions = new HashMap<>();
    private static CropSoilManagementSystemGUI instance;

    public static void main(String[] args) {
        initializeData();
        SwingUtilities.invokeLater(() -> {
            instance = new CropSoilManagementSystemGUI();
            instance.createAndShowGUI();
        });
    }

    private static void initializeData() {
        // Mapping soil types to the most suited crops
        soilTypeMap.put(1, "Sandy - Carrots, Radishes, Potatoes");
        soilTypeMap.put(2, "Clay - Rice, Broccoli, Cabbage");
        soilTypeMap.put(3, "Loam - Wheat, Sugarcane, Cotton");

        // Mapping soil types to soil management tips
        soilManagementTips.put(1, "Add organic matter regularly to improve moisture retention.");
        soilManagementTips.put(2, "Improve drainage by adding organic matter like compost.");
        soilManagementTips.put(3, "Loam soil is fertile and easy to work with, just maintain good soil health.");

        // Fertilizer suggestions based on crops
        fertilizerSuggestions.put("Carrots", "NPK Fertilizer");
        fertilizerSuggestions.put("Rice", "Urea, DAP");
        fertilizerSuggestions.put("Wheat", "Ammonium Nitrate");

        // Pesticide suggestions based on identified diseases
        pesticideSuggestions.put("Nitrogen deficiency", "Apply urea.");
        pesticideSuggestions.put("Fungal infection", "Apply copper-based fungicides.");

        // Crop rotation suggestions based on current crop
        cropRotationSuggestions.put("Carrots", "Next, plant legumes like beans to restore nitrogen.");
        cropRotationSuggestions.put("Rice", "Next, plant pulses like lentils for soil rejuvenation.");
        cropRotationSuggestions.put("Wheat", "Next, plant oilseeds like mustard.");
    }

    private void createAndShowGUI() {
        setTitle("Crop and Soil Management System");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(500, 400);
        setLocationRelativeTo(null);

        showLoginScreen();

        setVisible(true);
    }

    private void showLoginScreen() {
        getContentPane().removeAll();
        JPanel loginPanel = new JPanel(new GridLayout(4, 2, 10, 10));

        JLabel userLabel = new JLabel("Username:");
        JTextField userText = new JTextField(20);
        JLabel passwordLabel = new JLabel("Password:");
        JPasswordField passwordText = new JPasswordField(20);
        JButton loginButton = new JButton("Login");
        JButton registerButton = new JButton("Register");

        loginButton.addActionListener(e -> handleLogin(userText.getText(), new String(passwordText.getPassword())));
        registerButton.addActionListener(e -> showRegistrationScreen());

        loginPanel.add(userLabel);
        loginPanel.add(userText);
        loginPanel.add(passwordLabel);
        loginPanel.add(passwordText);
        loginPanel.add(loginButton);
        loginPanel.add(registerButton);

        add(loginPanel, BorderLayout.CENTER);
        revalidate();
        repaint();
    }

    private void showRegistrationScreen() {
        getContentPane().removeAll();
        JPanel registerPanel = new JPanel(new GridLayout(4, 2, 10, 10));

        JLabel userLabel = new JLabel("Username:");
        JTextField userText = new JTextField(20);
        JLabel passwordLabel = new JLabel("Password:");
        JPasswordField passwordText = new JPasswordField(20);
        JButton registerButton = new JButton("Register");
        JButton backButton = new JButton("Back");

        registerButton.addActionListener(e -> handleRegistration(userText.getText(), new String(passwordText.getPassword())));
        backButton.addActionListener(e -> showLoginScreen());

        registerPanel.add(userLabel);
        registerPanel.add(userText);
        registerPanel.add(passwordLabel);
        registerPanel.add(passwordText);
        registerPanel.add(registerButton);
        registerPanel.add(backButton);

        add(registerPanel, BorderLayout.CENTER);
        revalidate();
        repaint();
    }

    private void handleLogin(String username, String password) {
        Farmer farmer = farmers.get(username);
        if (farmer != null && farmer.password.equals(password)) {
            JOptionPane.showMessageDialog(this, "Login successful!");
            showFarmerMenu(username);
        } else {
            JOptionPane.showMessageDialog(this, "Invalid username or password.");
        }
    }

    private void handleRegistration(String username, String password) {
        if (farmers.containsKey(username)) {
            JOptionPane.showMessageDialog(this, "Username already taken.");
        } else {
            farmers.put(username, new Farmer(username, password));
            farmerCropHistory.put(username, new CropHistory());
            JOptionPane.showMessageDialog(this, "Registration successful!");
            showLoginScreen();
        }
    }

    private void showFarmerMenu(String username) {
        getContentPane().removeAll();
        JPanel farmerPanel = new JPanel(new GridLayout(6, 1, 10, 10));

        JButton selectCropButton = new JButton("Select Crop");
        JButton soilTipsButton = new JButton("Soil Management Tips");
        JButton identifyDiseaseButton = new JButton("Identify Disease");
        JButton viewHistoryButton = new JButton("View Crop History");
        JButton weatherSeasonButton = new JButton("Enter Weather & Season");
        JButton logoutButton = new JButton("Logout");

        selectCropButton.addActionListener(e -> selectCrop(username));
        soilTipsButton.addActionListener(e -> getSoilManagementTips());
        identifyDiseaseButton.addActionListener(e -> identifyDisease());
        viewHistoryButton.addActionListener(e -> viewCropHistory(username));
        weatherSeasonButton.addActionListener(e -> enterWeatherSeason(username));
        logoutButton.addActionListener(e -> showLoginScreen());

        farmerPanel.add(selectCropButton);
        farmerPanel.add(soilTipsButton);
        farmerPanel.add(identifyDiseaseButton);
        farmerPanel.add(viewHistoryButton);
        farmerPanel.add(weatherSeasonButton);
        farmerPanel.add(logoutButton);

        add(farmerPanel, BorderLayout.CENTER);
        revalidate();
        repaint();
    }

    private void selectCrop(String username) {
        StringBuilder options = new StringBuilder("Select your soil type:\n");
        for (Map.Entry<Integer, String> entry : soilTypeMap.entrySet()) {
            options.append(entry.getKey()).append(". ").append(entry.getValue()).append("\n");
        }
        String input = JOptionPane.showInputDialog(this, options.toString());

        try {
            int choice = Integer.parseInt(input);
            String crops = soilTypeMap.get(choice);
            if (crops != null) {
                JOptionPane.showMessageDialog(this, "Suggested crops: " + crops);
                farmerCropHistory.get(username).addCrop(crops);
                
                String cropName = crops.split(" - ")[1].split(",")[0];  // Get the first crop
                suggestFertilizer(cropName);
                suggestCropRotation(cropName);
            } else {
                JOptionPane.showMessageDialog(this, "Invalid choice. Please select a valid number.");
            }
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(this, "Invalid input. Please enter a number.");
        }
    }

    private void getSoilManagementTips() {
        StringBuilder options = new StringBuilder("Select your soil type:\n");
        for (Map.Entry<Integer, String> entry : soilManagementTips.entrySet()) {
            options.append(entry.getKey()).append(". ").append(entry.getValue()).append("\n");
        }
        String input = JOptionPane.showInputDialog(this, options.toString());

        try {
            int choice = Integer.parseInt(input);
            String tips = soilManagementTips.get(choice);
            if (tips != null) {
                JOptionPane.showMessageDialog(this, "Soil management tips: " + tips);
            } else {
                JOptionPane.showMessageDialog(this, "Invalid choice. Please select a valid number.");
            }
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(this, "Invalid input. Please enter a number.");
        }
    }

    private void identifyDisease() {
        String symptoms = JOptionPane.showInputDialog(this, "Enter the symptoms (e.g., yellow leaves, spots on leaves):");
        String disease = Disease.identifyDisease(symptoms);
        JOptionPane.showMessageDialog(this, disease);
        
        if (disease != null && pesticideSuggestions.containsKey(disease)) {
            String pesticide = pesticideSuggestions.get(disease);
            JOptionPane.showMessageDialog(this, "Suggested pesticide: " + pesticide);
        }
    }

    private void viewCropHistory(String username) {
        List<String> history = farmerCropHistory.get(username).getCropHistory();
        JOptionPane.showMessageDialog(this, "Your crop history: " + String.join(", ", history));
    }

    private void enterWeatherSeason(String username) {
        String weather = JOptionPane.showInputDialog(this, "Enter current weather (e.g., sunny, rainy, dry):");
        String season = JOptionPane.showInputDialog(this, "Enter current season (e.g., summer, winter, monsoon):");

        farmerCropHistory.get(username).setWeatherSeason(weather, season);
        JOptionPane.showMessageDialog(this, "Weather and season updated.");
    }

    private void suggestFertilizer(String cropName) {
        if (fertilizerSuggestions.containsKey(cropName)) {
            String fertilizer = fertilizerSuggestions.get(cropName);
            JOptionPane.showMessageDialog(this, "Suggested fertilizer for " + cropName + ": " + fertilizer);
        }
    }

    private void suggestCropRotation(String cropName) {
        if (cropRotationSuggestions.containsKey(cropName)) {
            String rotation = cropRotationSuggestions.get(cropName);
            JOptionPane.showMessageDialog(this, "Suggested crop rotation after " + cropName + ": " + rotation);
        }
    }
}

class Disease {
    static String identifyDisease(String symptoms) {
        if (symptoms.toLowerCase().contains("yellow leaves")) {
            return "Nitrogen deficiency";
        } else if (symptoms.toLowerCase().contains("spots on leaves")) {
            return "Fungal infection";
        }
        return "Unknown disease";
    }
}

class CropHistory {
    private List<String> cropsPlanted = new ArrayList<>();
    private String weather;
    private String season;

    void addCrop(String crop) {
        cropsPlanted.add(crop);
    }

    List<String> getCropHistory() {
        return cropsPlanted;
    }

    void setWeatherSeason(String weather, String season) {
        this.weather = weather;
        this.season = season;
    }
}
