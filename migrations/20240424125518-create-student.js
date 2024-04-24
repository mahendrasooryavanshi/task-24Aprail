"use strict";

const { sequelize } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Students", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      studentName: {
        type: Sequelize.STRING,
        field: "student_name",
        allowNull: false,
      },
      collageName: {
        type: Sequelize.STRING,
        field: "collage_name",
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("Placed", "Not Placed"),
        allowNull: false,
        defaultValue: "Not Placed",
      },
      DSA_Final_Score: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
        field: "dsa_score",
      },
      Web_Final_Score: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
        field: "web_final_score",
      },
      React_Final_Score: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
        field: "react_final_score",
      },
      interviewDate: {
        type: sequelize.DATE,
        allowNull: true,
        defaultValue: null,
        field: "interview_date",
      },
      interviewCompany: {
        type: sequelize.STRING,
        allowNull: true,
        defaultValue: null,
        field: "interview_company",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "created_at",
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "updated_at",
      },
      deletedAt: {
        allowNull: true,
        field: "deleted_at",
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Students");
  },
};
