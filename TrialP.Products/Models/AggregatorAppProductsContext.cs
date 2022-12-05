using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace TrialP.Products.Models;

public partial class AggregatorAppProductsContext : DbContext
{
    public AggregatorAppProductsContext()
    {
    }

    public AggregatorAppProductsContext(DbContextOptions<AggregatorAppProductsContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<ProductReview> ProductReviews { get; set; }

    public virtual DbSet<Shop> Shops { get; set; }

    public virtual DbSet<ShopAddress> ShopAddresses { get; set; }

    public virtual DbSet<ShopPhone> ShopPhones { get; set; }

    public virtual DbSet<ShopPhoneShopAddress> ShopPhoneShopAddresses { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=localhost;Database=AggregatorAppProducts;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC076BA4CAFD");

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Products__3214EC076FD4430E");

            entity.HasIndex(e => e.ApiId, "UQ__Products__024B3BB20593B2C8").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Products__Catego__6BE40491");

            entity.HasOne(d => d.Shop).WithMany(p => p.Products)
                .HasForeignKey(d => d.ShopId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Products__ShopId__6CD828CA");
        });

        modelBuilder.Entity<ProductReview>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ProductR__3214EC07DAAD0A00");

            entity.HasIndex(e => e.ApiProductId, "UQ__ProductR__9CEF38B978821AE7").IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
            entity.Property(e => e.ApiCreated).HasColumnType("datetime");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductReviews)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__ProductRe__Produ__719CDDE7");
        });

        modelBuilder.Entity<Shop>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Shops__3214EC07D9C4D52D");

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");

            entity.HasOne(d => d.ShopPhoneShopAddresses).WithMany(p => p.Shops)
                .HasForeignKey(d => d.ShopPhoneShopAddressesId)
                .HasConstraintName("FK__Shops__ShopPhone__671F4F74");
        });

        modelBuilder.Entity<ShopAddress>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ShopAddr__3214EC07C1B53BE9");

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
        });

        modelBuilder.Entity<ShopPhone>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ShopPhon__3214EC071A0DA8C7");

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");
        });

        modelBuilder.Entity<ShopPhoneShopAddress>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ShopPhon__3214EC07C9A9737E");

            entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");

            entity.HasOne(d => d.ShopAddresses).WithMany(p => p.ShopPhoneShopAddresses)
                .HasForeignKey(d => d.ShopAddressesId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_ShopAddresses");

            entity.HasOne(d => d.ShopPhones).WithMany(p => p.ShopPhoneShopAddresses)
                .HasForeignKey(d => d.ShopPhonesId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_ShopPhones");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
