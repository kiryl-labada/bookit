﻿// <auto-generated />
using System;
using Bookit.Web.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Bookit.Web.Data.Migrations
{
    [DbContext(typeof(BookingContext))]
    [Migration("20220404195344_AddForeignKeyToMapObjectView")]
    partial class AddForeignKeyToMapObjectView
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasDefaultSchema("bookit")
                .HasAnnotation("ProductVersion", "6.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Bookit.Web.Data.Models.MapObject", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("boolean");

                    b.Property<int?>("MapId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("State")
                        .HasColumnType("integer");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("MapObjects", "bookit");
                });

            modelBuilder.Entity("Bookit.Web.Data.Models.MapObjectView", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("BackgroundUrl")
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("MapObjectId")
                        .HasColumnType("integer");

                    b.Property<string>("Structure")
                        .HasColumnType("jsonb");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("MapObjectId")
                        .IsUnique();

                    b.ToTable("MapObjectViews", "bookit");
                });

            modelBuilder.Entity("Bookit.Web.Data.Models.Story", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Stories", "bookit");
                });

            modelBuilder.Entity("Bookit.Web.Data.Models.TaskItem", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("StoryId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("StoryId");

                    b.ToTable("TaskItems", "bookit");
                });

            modelBuilder.Entity("Bookit.Web.Data.Models.MapObjectView", b =>
                {
                    b.HasOne("Bookit.Web.Data.Models.MapObject", "MapObject")
                        .WithOne("MapObjectView")
                        .HasForeignKey("Bookit.Web.Data.Models.MapObjectView", "MapObjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MapObject");
                });

            modelBuilder.Entity("Bookit.Web.Data.Models.TaskItem", b =>
                {
                    b.HasOne("Bookit.Web.Data.Models.Story", "Story")
                        .WithMany("TaskItems")
                        .HasForeignKey("StoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Story");
                });

            modelBuilder.Entity("Bookit.Web.Data.Models.MapObject", b =>
                {
                    b.Navigation("MapObjectView");
                });

            modelBuilder.Entity("Bookit.Web.Data.Models.Story", b =>
                {
                    b.Navigation("TaskItems");
                });
#pragma warning restore 612, 618
        }
    }
}
