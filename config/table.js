exports.table = [
  {
    tableName: "user",
    query: "CREATE TABLE IF NOT EXISTS user (id BIGINT AUTO_INCREMENT PRIMARY KEY,user_name VARCHAR(255) NULL,first_name VARCHAR(255) NULL,last_name VARCHAR(255) NULL,email VARCHAR(255) NULL UNIQUE,password VARCHAR(255) NULL,otp INT NULL,otp_time VARCHAR(255) NULL, user_type VARCHAR(255) NOT NULL,is_deleted ENUM('0','1') DEFAULT '0',is_block ENUM('0','1') DEFAULT '0',last_login VARCHAR(255) NULL,ip VARCHAR(255) NULL,wish_list TEXT NULL,createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)",
  },
  {
    tableName: "banner",
    query:
      "CREATE TABLE IF NOT EXISTS banner (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NULL,image VARCHAR(255) NULL,status ENUM('0', '1') DEFAULT '0' COMMENT '0 is inactive , 1 is active',type ENUM('1','2'),show_banner ENUM('1','2','3') ,createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)",
  },
  {
   tableName:"main_category",
   query:"CREATE TABLE IF NOT EXISTS main_category(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255) NULL,status ENUM('0','1') DEFAULT '1',total_category INT DEFAULT 0,total_sub_category INT DEFAULT 0,createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)"
  },
  {
    tableName:"category",
    query:"CREATE TABLE IF NOT EXISTS category(id INT AUTO_INCREMENT PRIMARY KEY,main_category_id INT NULL,name VARCHAR(255) NULL,status ENUM('0','1') DEFAULT '1',total_sub_category INT DEFAULT 0,size TEXT NULL,start VARCHAR(255) NULL,end VARCHAR(255) NULL,step VARCHAR(255) NULL,size_name VARCHAR(255) NULL,createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)"
  },
  {
    tableName:"sub_category",
    query:"CREATE TABLE IF NOT EXISTS sub_category(id INT AUTO_INCREMENT PRIMARY KEY,main_category_id INT NULL,category_id INT NULL,name VARCHAR(255) NULL,status ENUM('0','1') NULL,createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)"
  },
  {
    tableName:"products",
    query:"CREATE TABLE IF NOT EXISTS products(id INT AUTO_INCREMENT PRIMARY KEY,main_category_id INT NULL,category_id INT NULL,sub_category_id INT NULL,title TEXT NULL, description TEXT NULL,images TEXT NULL,price TEXT NULL,short_description TEXT NULL,createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)"
  },
  {
    tableName:"home_title",
    query:"CREATE TABLE IF NOT EXISTS home_title(id INT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(255) NULL,product_ids TEXT NULL,total_products INT DEFAULT 0,status ENUM('1','0') DEFAULT '0')"
  },
  {
    tableName: "site_policy",
    query:
      "CREATE TABLE IF NOT EXISTS site_policy (id INT AUTO_INCREMENT PRIMARY KEY, shipping LONGTEXT NULL,return_policy LONGTEXT NULL,TAC LONGTEXT NULL,pp LONGTEXT NULL,createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)",
  },
  {
    tableName:"faq",
    query:"CREATE TABLE IF NOT EXISTS faq(id INT AUTO_INCREMENT PRIMARY KEY,question TEXT NULL,answer TEXT NULL,status ENUM('1','0') DEFAULT '0',createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)"
  },
  {
    tableName:"order_history",
    query:"CREATE TABLE IF NOT EXISTS order_history(id INT AUTO_INCREMENT PRIMARY KEY,order_id VARCHAR(255) UNIQUE,user_id INT NULL,email VARCHAR(255) NULL,first_name VARCHAR(255) NULL, last_name VARCHAR(255) NULL,mobile_number VARCHAR(255) NULL,address VARCHAR(255) NULL,total DECIMAL(8,2) NULL,grand_total DECIMAL(8,2) NULL,discount DECIMAL(8,2) DEFAULT 0,shipping DECIMAL(8,2) DEFAULT 0,product_items TEXT NULL,status VARCHAR(255) NULL,createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)"
  },
  {
    tableName:"social_media",
    query:"CREATE TABLE IF NOT EXISTS social_media(id INT AUTO_INCREMENT PRIMARY KEY,title TEXT NULL,url TEXT NULL,status ENUM('1','0') DEFAULT '1',createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)"
  }
];
