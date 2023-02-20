using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace TrialP.Products.Models;

public partial class TrialPProductsContext : DbContext
{
    public TrialPProductsContext()
    {
    }

    public TrialPProductsContext(DbContextOptions<TrialPProductsContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<PositionsPrimary> PositionsPrimaries { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductShop> ProductShops { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<SubCategory> SubCategories { get; set; }

    public virtual DbSet<SubSubCategory> SubSubCategories { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=localhost;Database=TrialP_Products;Trusted_Connection=True;trustServerCertificate=true;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Category__3213E83F9F46C80F");

            entity.ToTable("Category");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("id");
            entity.Property(e => e.ApiName).HasColumnName("apiName");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Orders__3213E83FB6F1F02F");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("id");
            entity.Property(e => e.IsCompleted).HasColumnName("is_completed");
            entity.Property(e => e.Key).HasColumnName("key");
            entity.Property(e => e.OrderDate)
                .HasColumnType("datetime")
                .HasColumnName("order_date");
            entity.Property(e => e.PositionsPrimaryId).HasColumnName("positions_primary_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.PositionsPrimary).WithMany(p => p.Orders)
                .HasForeignKey(d => d.PositionsPrimaryId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Orders__position__4E88ABD4");
        });

        modelBuilder.Entity<PositionsPrimary>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Position__3213E83F656A90C8");

            entity.ToTable("PositionsPrimary");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("id");
            entity.Property(e => e.Amount)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("amount");
            entity.Property(e => e.ApiId).HasColumnName("apiId");
            entity.Property(e => e.Article).HasColumnName("article");
            entity.Property(e => e.Comment).HasColumnName("comment");
            entity.Property(e => e.Currency).HasColumnName("currency");
            entity.Property(e => e.Importer).HasColumnName("importer");
            entity.Property(e => e.Key).HasColumnName("key");
            entity.Property(e => e.ManufacturerId).HasColumnName("manufacturer_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.ProductIdApi).HasColumnName("product_id_api");
            entity.Property(e => e.ServiceCenters).HasColumnName("service_centers");
            entity.Property(e => e.ShopId).HasColumnName("shop_id");
            entity.Property(e => e.ShopIdApi).HasColumnName("shop_id_api");

            entity.HasOne(d => d.Product).WithMany(p => p.PositionsPrimaries)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Positions__produ__49C3F6B7");

            entity.HasOne(d => d.Shop).WithMany(p => p.PositionsPrimaries)
                .HasForeignKey(d => d.ShopId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Positions__shop___4AB81AF0");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Products__3213E83F868F8594");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("id");
            entity.Property(e => e.ApiId).HasColumnName("apiId");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.ExtendedName).HasColumnName("extended_name");
            entity.Property(e => e.FullName).HasColumnName("full_name");
            entity.Property(e => e.ImageHeader).HasColumnName("imageHeader");
            entity.Property(e => e.Key).HasColumnName("key");
            entity.Property(e => e.Microdescription).HasColumnName("microdescription");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.NamePrefix).HasColumnName("name_prefix");
            entity.Property(e => e.Offers).HasColumnName("offers");
            entity.Property(e => e.PriceMax)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("price_max");
            entity.Property(e => e.PriceMin)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("price_min");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.SubSubCategoryId).HasColumnName("sub_sub_category_id");

            entity.HasOne(d => d.SubSubCategory).WithMany(p => p.Products)
                .HasForeignKey(d => d.SubSubCategoryId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Products__sub_su__4316F928");
        });

        modelBuilder.Entity<ProductShop>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ProductS__3213E83F568854B8");

            entity.ToTable("ProductShop");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("id");
            entity.Property(e => e.ApiId).HasColumnName("apiId");
            entity.Property(e => e.Logo).HasColumnName("logo");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.Url).HasColumnName("url");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Reviews__3213E83F47578B7C");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("id");
            entity.Property(e => e.ApiProductId).HasColumnName("api_product_id");
            entity.Property(e => e.ApiId).HasColumnName("api_id");
            entity.Property(e => e.ApiProductUrl).HasColumnName("api_product_url");
            entity.Property(e => e.ApiUserId).HasColumnName("api_user_id");
            entity.Property(e => e.Cons).HasColumnName("cons");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.Pros).HasColumnName("pros");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.Summary).HasColumnName("summary");
            entity.Property(e => e.Text).HasColumnName("text");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Product).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Reviews__product__52593CB8");
        });

        modelBuilder.Entity<SubCategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SubCateg__3213E83F747D6C3E");

            entity.ToTable("SubCategory");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("id");
            entity.Property(e => e.ApiName).HasColumnName("apiName");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.Image).HasColumnName("image");
            entity.Property(e => e.Name).HasColumnName("name");

            entity.HasOne(d => d.Category).WithMany(p => p.SubCategories)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__SubCatego__categ__3B75D760");
        });

        modelBuilder.Entity<SubSubCategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SubSubCa__3213E83FFA9450E4");

            entity.ToTable("SubSubCategory");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("id");
            entity.Property(e => e.ApiName).HasColumnName("apiName");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.SubCategoryId).HasColumnName("sub_category_id");

            entity.HasOne(d => d.SubCategory).WithMany(p => p.SubSubCategories)
                .HasForeignKey(d => d.SubCategoryId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__SubSubCat__sub_c__3F466844");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
