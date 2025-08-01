import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '@src/database/entities/category.entity';
import {
  ReturnCategoryDto,
  ReturnStringDto,
} from '@src/dtos/return-message.dto';
import { Repository } from 'typeorm';

Injectable();
export class CategoryService {
  constructor(
    @InjectRepository(Categories)
    private categoryRepository: Repository<Categories>,
  ) {}

  async addCategory(categoryName: string): Promise<ReturnStringDto> {
    categoryName =
      categoryName.charAt(0).toUpperCase() +
      categoryName.slice(1).toLowerCase();

    const existingCategory = await this.categoryRepository.findOne({
      where: { categoryName: categoryName },
    });

    if (existingCategory) {
      console.log(`Category "${categoryName}" already exists.`);
      return {
        statusCode: 200,
        message: `Category "${categoryName}" already exists.`,
      };
    }

    const newCategory = this.categoryRepository.create({
      categoryName: categoryName,
    });
    await this.categoryRepository.save(newCategory);

    console.log(`Category "${categoryName}" created successfully.`);
    return {
      statusCode: 201,
      message: `Category "${categoryName}" created successfully.`,
    };
  }

  async updateCategory(
    oldCategoryName: string,
    newCategoryName: string,
  ): Promise<ReturnStringDto> {
    oldCategoryName =
      oldCategoryName.charAt(0).toUpperCase() +
      oldCategoryName.slice(1).toLowerCase();
    newCategoryName =
      newCategoryName.charAt(0).toUpperCase() +
      newCategoryName.slice(1).toLowerCase();

    const existingOldCategory = await this.categoryRepository.findOne({
      where: { categoryName: oldCategoryName },
    });
    const existingNewCategory = await this.categoryRepository.findOne({
      where: { categoryName: newCategoryName },
    });

    if (!existingOldCategory) {
      console.log(`Category "${oldCategoryName}" does not exist.`);
      return {
        statusCode: 404,
        message: `Category "${oldCategoryName}" does not exist.`,
      };
    }
    if (existingNewCategory) {
      console.log(
        `Category name "${existingNewCategory.categoryName}" already exists.`,
      );
      return {
        statusCode: 400,
        message: `Category name "${existingNewCategory.categoryName}" already exists.`,
      };
    }

    existingOldCategory.categoryName = newCategoryName;
    existingOldCategory.lastUpdate = new Date();
    await this.categoryRepository.save(existingOldCategory);

    console.log(
      `Updated category "${oldCategoryName}" --> "${newCategoryName}".`,
    );
    return {
      statusCode: 200,
      message: `Updated category "${oldCategoryName}" --> "${newCategoryName}".`,
    };
  }

  async deleteCategory(categoryName: string): Promise<ReturnStringDto> {
    categoryName =
      categoryName.charAt(0).toUpperCase() +
      categoryName.slice(1).toLowerCase();

    const existingCategory = await this.categoryRepository.findOne({
      where: { categoryName: categoryName },
    });

    if (!existingCategory) {
      console.log(`Category "${categoryName}" does not exist.`);
      return {
        statusCode: 404,
        message: `Category "${categoryName}" does not exist.`,
      };
    }

    await this.categoryRepository.remove(existingCategory);
    console.log(`Category "${categoryName}" deleted successfully.`);
    return {
      statusCode: 200,
      message: `Category "${categoryName}" deleted successfully.`,
    };
  }

  async getAllCategories(): Promise<ReturnCategoryDto> {
    console.log('Fetching all categories...');
    const categoriesDb = await this.categoryRepository.find();

    const categories = categoriesDb.map((category) => category.categoryName);
    console.log(`Found ${categories.length} categories.`);
    return {
      statusCode: 200,
      categories: categories,
    };
  }
}
