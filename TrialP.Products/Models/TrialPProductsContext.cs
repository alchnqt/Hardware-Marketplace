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

    public virtual DbSet<SubCategory> SubCategories { get; set; }

    public virtual DbSet<SubSubCategory> SubSubCategories { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=localhost;Database=TrialP_Products;User=sa;Password=1234;trustServerCertificate=true;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Category__3213E83F223338CC");

            entity.ToTable("Category");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("id");
            entity.Property(e => e.ApiName).HasColumnName("apiName");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Orders__3213E83F69673FE9");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("id");
            entity.Property(e => e.IsCompleted).HasColumnName("is_completed");
            entity.Property(e => e.UserId).HasColumnName("user_id"); 
            entity.Property(e => e.Key).HasColumnName("key");
            entity.Property(e => e.OrderDate)
                .HasColumnType("datetime")
                .HasColumnName("order_date");
            entity.Property(e => e.PositionsPrimaryId).HasColumnName("positions_primary_id");

            entity.HasOne(d => d.PositionsPrimary).WithMany(p => p.Orders)
                .HasForeignKey(d => d.PositionsPrimaryId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Orders__position__5812160E");
        });

        modelBuilder.Entity<PositionsPrimary>(entity =>
        {
            entity.HasKey(e => e.IdDb).HasName("PK__Position__3213E83F09B691F8");

            entity.ToTable("PositionsPrimary");

            entity.Property(e => e.IdDb)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("id");
            entity.Property(e => e.ApiId).HasColumnName("apiId");
            entity.Property(e => e.Article).HasColumnName("article");
            entity.Property(e => e.Key).HasColumnName("key");
            entity.Property(e => e.ManufacturerId).HasColumnName("manufacturer_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.ProductIdApi).HasColumnName("product_id_api");
            entity.Property(e => e.ShopId).HasColumnName("shop_id");
            entity.Property(e => e.Comment).HasColumnName("comment");
            entity.Property(e => e.ServiceCenters).HasColumnName("service_centers");
            entity.Property(e => e.Importer).HasColumnName("importer");
            entity.Property(e => e.Amount).HasColumnType("decimal(8, 2)").HasColumnName("amount"); ;
            entity.Property(e => e.Currency).HasColumnName("currency");
            entity.Property(e => e.ShopIdApi).HasColumnName("shop_id_api");

            entity.HasOne(d => d.Product).WithMany(p => p.PositionsPrimaries)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Positions__produ__534D60F1");

            entity.HasOne(d => d.Shop).WithMany(p => p.PositionsPrimaries)
                .HasForeignKey(d => d.ShopId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Positions__shop___5441852A");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.IdDb).HasName("PK__Products__3213E83FDD250E2C");

            entity.Property(e => e.IdDb)
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
                .HasConstraintName("FK__Products__sub_su__4CA06362");
        });

        modelBuilder.Entity<ProductShop>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ProductS__3213E83FF5F47A49");

            entity.ToTable("ProductShop");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("id");
            entity.Property(e => e.ApiId).HasColumnName("apiId");
            entity.Property(e => e.Logo).HasColumnName("logo");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.Url).HasColumnName("url");
        });

        modelBuilder.Entity<SubCategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SubCateg__3213E83F017057BE");

            entity.ToTable("SubCategory");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("id");
            entity.Property(e => e.ApiName).HasColumnName("apiName");
            entity.Property(e => e.Image).HasColumnName("image");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.Name).HasColumnName("name");

            entity.HasOne(d => d.Category).WithMany(p => p.SubCategories)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__SubCatego__categ__44FF419A");
        });

        modelBuilder.Entity<SubSubCategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SubSubCa__3213E83F144E6CEB");

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
                .HasConstraintName("FK__SubSubCat__sub_c__48CFD27E");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
