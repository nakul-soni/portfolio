package com.nakul.chatbot;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.io.IOException;

public class ChatBot extends JFrame implements ActionListener {

    private JLabel welcomeLabel;
    private JTextArea chatArea;
    private JTextField inputField;
    private JButton sendButton;
    private JPanel inputPanel;
    DeepSeekAPI api = new DeepSeekAPI();

    public ChatBot() {
        setTitle("Chat Bot");
        setSize(700, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        // Background panel with gradient
        JPanel mainPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2d = (Graphics2D) g;
                GradientPaint gp = new GradientPaint(0, 0, new Color(45, 45, 45), 0, getHeight(), new Color(25, 25, 25));
                g2d.setPaint(gp);
                g2d.fillRect(0, 0, getWidth(), getHeight());
            }
        };
        mainPanel.setLayout(new BorderLayout());
        setContentPane(mainPanel);

        // Header
        welcomeLabel = new JLabel("Welcome to Chat Bot", SwingConstants.CENTER);
        welcomeLabel.setForeground(new Color(255, 215, 0));
        welcomeLabel.setFont(new Font("Serif", Font.BOLD, 40));
        welcomeLabel.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        mainPanel.add(welcomeLabel, BorderLayout.NORTH);

        // Chat display area
        chatArea = new JTextArea(20, 50);
        chatArea.setEditable(false);
        chatArea.setBackground(new Color(50, 50, 50));
        chatArea.setForeground(new Color(0, 255, 150));
        chatArea.setFont(new Font("Monospaced", Font.PLAIN, 18));
        chatArea.setMargin(new Insets(10, 10, 10, 10));
        JScrollPane scrollPane = new JScrollPane(chatArea);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());
        mainPanel.add(scrollPane, BorderLayout.CENTER);

        // Input field
        inputField = new JTextField(40);
        inputField.setBackground(new Color(70, 70, 70));
        inputField.setForeground(Color.WHITE);
        inputField.setFont(new Font("SansSerif", Font.PLAIN, 18));
        inputField.setCaretColor(Color.WHITE);
        inputField.setBorder(BorderFactory.createEmptyBorder(10, 15, 10, 15));
        inputField.addActionListener(this);

        // Send button
        sendButton = new JButton("Send");
        sendButton.setForeground(Color.WHITE);
        sendButton.setFont(new Font("SansSerif", Font.BOLD, 18));
        sendButton.setFocusPainted(false);
        sendButton.setContentAreaFilled(false);
        sendButton.setOpaque(false);
        sendButton.addActionListener(this);

        // Input panel
        inputPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 10));
        inputPanel.setBackground(new Color(30, 30, 30));
        inputPanel.add(inputField);
        inputPanel.add(sendButton);
        mainPanel.add(inputPanel, BorderLayout.SOUTH);

        // Initial message
        printBot("Hello! I'm ChatBot. How can I help you today?");
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        String userInput = inputField.getText().trim();
        if (!userInput.isEmpty()) {
            printUser(userInput);
            String response = getBotResponse(userInput);
            printBot(response);
            inputField.setText("");
        }
    }

    private void printUser(String message) {
        chatArea.append("You: " + message + "\n");
    }

    private void printBot(String message) {
        chatArea.append("Bot: " + message + "\n\n");
    }

    private String getBotResponse(String input) {
        input = input.toLowerCase();

       

        // Fallback to DeepSeek API
        try {
            return api.sendMessage(input);
        } catch (IOException ex) {
            ex.printStackTrace();
            return "[API Error] Could not connect to DeepSeek.";
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            ChatBot chatBot = new ChatBot();
            chatBot.setVisible(true);
        });
    }
}
