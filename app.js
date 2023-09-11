// Base URL and API endpoints
const baseUrl = "https://humanmanager.tangerinelms.com/www/api/v1";
const courseCategoriesEndpoint = "/get_course_catalogue.php";

// Function to fetch course categories
async function fetchCourseCategories() {
  try {
    const response = await fetch(`${baseUrl}${courseCategoriesEndpoint}`);

    if (!response.ok) {
      throw new Error(
        `Error fetching course categories. Status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log(data.data);

    displayCourseCategories(data.data);
    displaySubCourseCategories(data.data);
  } catch (error) {
    console.error("Error fetching course categories:", error.message);
  }
}
// Function to display course categories
function displayCourseCategories(categories) {
  const categoriesContainer = document.getElementById("categories");
  categoriesContainer.innerHTML = "";

  categories.forEach((category) => {
    const categoryElement = document.createElement("div");
    categoryElement.innerHTML = `
           <div class="categories shadow-lg p-3 mb-5 bg-white rounded">
           <img src="${category.Image}" alt="" class="category-image" >
           <h4>${category.Name}</h4>
           </div>
           `;
    categoriesContainer.appendChild(categoryElement);

    // Fetch and display sub-categories from category.path
    fetchSubCategories(category.path, `${category.path}-subcategories`);

    // fetchSubCategories(category.Path);
  });
}
// Function to display sub-categories
function displaySubCourseCategories(subcategories) {
  const subCategoriesContainer = document.getElementById("sub-categories");
  subCategoriesContainer.innerHTML = "";
  subcategories.forEach((subcategoryObject) => {
    for (const key in subcategoryObject) {
      if (Array.isArray(subcategoryObject[key])) {
        console.log(subcategoryObject, "sub-categories");

        subcategoryObject[key].map((subCategory) => {
          const subCatElement = document.createElement("div");

          subCatElement.innerHTML = `
                   <div class="categories shadow-lg p-3 mb-5 bg-white rounded">
                       <img src="${subCategory.Image}" alt="" class="category-image" >
                       <h4>${subCategory.Name}</h4>
                   </div>
               `;
          subCategoriesContainer.appendChild(subCatElement);
        });
      }
    }
  });
}

// Function to fetch sub-categories
async function fetchSubCategories(category_path, subCategoriesContainerId) {
  const subCategoriesEndpoint = `/get_category_courses.php?category=${category_path}`;
  try {
    const response = await fetch(`${baseUrl}${subCategoriesEndpoint}`, {
      mode: "no-cors",
    });
    const data = await response.json();
    console.log(data, "sub category data");
    displaySubCategories(data, subCategoriesContainerId);
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
  }
}

// Function to display sub-categories
function displaySubCategories(subCategories, subCategoriesContainerId) {
  console.log(subCategories, "subCategories");
  const subCategoriesContainer = document.getElementById(
    subCategoriesContainerId
  );
  subCategoriesContainer.innerHTML = "";

  subCategories.forEach((subCategory) => {
    const subCategoryElement = document.createElement("li");
    subCategoryElement.innerHTML = `<a href="#">${subCategory.name}</a>`;
    subCategoriesContainer.appendChild(subCategoryElement);

    // Attach click event to sub-category link
    subCategoryElement.addEventListener("click", () => {
      fetchCategoryCourses(subCategory.category_path);
    });
  });
}

// Function to fetch and display courses for a specific category
async function fetchCategoryCourses(categoryPath) {
  const categoryCoursesEndpoint = `/get_sub_category_courses.php?category=${categoryPath}`;
  try {
    const response = await fetch(`${baseUrl}${categoryCoursesEndpoint}`);
    const data = await response.json();
    // Display the courses or perform any other desired action
    console.log(data);
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
}

// i initialize page by fetching and displaying course categories
fetchCourseCategories();
