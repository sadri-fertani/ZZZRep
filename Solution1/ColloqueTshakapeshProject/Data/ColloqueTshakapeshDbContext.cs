using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ColloqueTshakapeshProject.Data
{
    public partial class ColloqueTshakapeshDbContext : DbContext
    {
        private readonly IConfiguration _config;

        public ColloqueTshakapeshDbContext(IConfiguration config)
        {
            _config = config;
        }

        public ColloqueTshakapeshDbContext(DbContextOptions<ColloqueTshakapeshDbContext> options, IConfiguration config)
            : base(options)
        {
            _config = config;
        }

        public virtual DbSet<AspNetRoleClaims> AspNetRoleClaims { get; set; }
        public virtual DbSet<AspNetRoles> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUserClaims> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogins> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUserRoles> AspNetUserRoles { get; set; }
        public virtual DbSet<AspNetUserTokens> AspNetUserTokens { get; set; }
        public virtual DbSet<AspNetUsers> AspNetUsers { get; set; }
        public virtual DbSet<Colloques> Colloques { get; set; }
        public virtual DbSet<DeviceCodes> DeviceCodes { get; set; }
        public virtual DbSet<Ecoles> Ecoles { get; set; }
        public virtual DbSet<Fonctions> Fonctions { get; set; }
        public virtual DbSet<Inscriptions> Inscriptions { get; set; }
        public virtual DbSet<Participants> Participants { get; set; }
        public virtual DbSet<PersistedGrants> PersistedGrants { get; set; }
        public virtual DbSet<TypeColloque> TypeColloque { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite(_config.GetConnectionString("DefaultConnection"));
            }
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {


            modelBuilder.HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

            modelBuilder.Entity<AspNetRoleClaims>(entity =>
            {
                entity.HasIndex(e => e.RoleId);

                entity.Property(e => e.RoleId).IsRequired();

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetRoleClaims)
                    .HasForeignKey(d => d.RoleId);
            });

            modelBuilder.Entity<AspNetRoles>(entity =>
            {
                entity.HasIndex(e => e.NormalizedName)
                    .HasName("RoleNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedName] IS NOT NULL)");

                entity.Property(e => e.Name).HasMaxLength(256);

                entity.Property(e => e.NormalizedName).HasMaxLength(256);
            });

            modelBuilder.Entity<AspNetUserClaims>(entity =>
            {
                entity.HasIndex(e => e.UserId);

                entity.Property(e => e.UserId).IsRequired();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserClaims)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserLogins>(entity =>
            {
                entity.HasKey(e => new { e.LoginProvider, e.ProviderKey });

                entity.HasIndex(e => e.UserId);

                entity.Property(e => e.LoginProvider).HasMaxLength(128);

                entity.Property(e => e.ProviderKey).HasMaxLength(128);

                entity.Property(e => e.UserId).IsRequired();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserLogins)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserRoles>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.RoleId });

                entity.HasIndex(e => e.RoleId);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetUserRoles)
                    .HasForeignKey(d => d.RoleId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserRoles)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserTokens>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name });

                entity.Property(e => e.LoginProvider).HasMaxLength(128);

                entity.Property(e => e.Name).HasMaxLength(128);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserTokens)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUsers>(entity =>
            {
                entity.HasIndex(e => e.NormalizedEmail)
                    .HasName("EmailIndex");

                entity.HasIndex(e => e.NormalizedUserName)
                    .HasName("UserNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedUserName] IS NOT NULL)");

                entity.Property(e => e.Email).HasMaxLength(256);

                entity.Property(e => e.NormalizedEmail).HasMaxLength(256);

                entity.Property(e => e.NormalizedUserName).HasMaxLength(256);

                entity.Property(e => e.UserName).HasMaxLength(256);
            });

            modelBuilder.Entity<Colloques>(entity =>
            {
                entity.HasKey(e => e.Id)
                    .HasName("PK_Conference");

                entity.Property(e => e.Cout).HasColumnType("decimal(6, 2)");

                entity.Property(e => e.Titre).IsRequired();

                entity.Property(e => e.Responsable).IsRequired();

                entity.Property(e => e.Cout).HasColumnType("decimal(6, 2)");

                entity.Property(e => e.DateColloque).HasColumnType("datetime");

                entity.HasOne(d => d.Type)
                    .WithMany(p => p.Colloques)
                    .HasForeignKey(d => d.TypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Colloques_TypeColloque");
            });

            modelBuilder.Entity<DeviceCodes>(entity =>
            {
                entity.HasKey(e => e.UserCode);

                entity.HasIndex(e => e.DeviceCode)
                    .IsUnique();

                entity.HasIndex(e => e.Expiration);

                entity.Property(e => e.UserCode).HasMaxLength(200);

                entity.Property(e => e.ClientId)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Data).IsRequired();

                entity.Property(e => e.DeviceCode)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.SubjectId).HasMaxLength(200);
            });

            modelBuilder.Entity<Ecoles>(entity =>
            {
                entity.HasKey(e => e.Id)
                    .HasName("PK_Ecole");

                entity.Property(e => e.Nom).IsRequired();

                entity.Property(e => e.Telephone).HasMaxLength(10);
            });

            modelBuilder.Entity<Fonctions>(entity =>
            {
                entity.HasKey(e => e.Id)
                    .HasName("PK_Fonction");

                entity.Property(e => e.Nom).IsRequired();
            });

            modelBuilder.Entity<Inscriptions>(entity =>
            {
                entity.HasKey(e => new { e.Id })
                    .HasName("PK_Partcipants_Conferences");

                entity.Property(e => e.DateCreation)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Guid)
                    .IsRequired()
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.HasOne(d => d.Colloque)
                    .WithMany(p => p.Inscriptions)
                    .HasForeignKey(d => d.ColloqueId)
                    .HasConstraintName("FK_Partcipants_Conferences_Conference_Heur_Conference_HeurId");

                entity.HasOne(d => d.Participant)
                    .WithMany(p => p.Inscriptions)
                    .HasForeignKey(d => d.ParticipantId)
                    .HasConstraintName("FK_Partcipants_Conferences_Participant_ParticipantId");
            });

            modelBuilder.Entity<Participants>(entity =>
            {
                entity.HasKey(e => e.Id)
                    .HasName("PK_Participant");

                entity.Property(e => e.Nom).IsRequired();

                entity.Property(e => e.Prenom).IsRequired();

                entity.Property(e => e.Telephone).HasMaxLength(10);

                entity.HasOne(d => d.Ecole)
                    .WithMany(p => p.Participants)
                    .HasForeignKey(d => d.EcoleId)
                    .HasConstraintName("FK_Participant_Ecole_EcoleId");

                entity.HasOne(d => d.Fonction)
                    .WithMany(p => p.Participants)
                    .HasForeignKey(d => d.FonctionId)
                    .HasConstraintName("FK_Participant_Fonction_FonctionId");
            });

            modelBuilder.Entity<PersistedGrants>(entity =>
            {
                entity.HasKey(e => e.Key);

                entity.HasIndex(e => e.Expiration);

                entity.HasIndex(e => new { e.SubjectId, e.ClientId, e.Type });

                entity.Property(e => e.Key).HasMaxLength(200);

                entity.Property(e => e.ClientId)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Data).IsRequired();

                entity.Property(e => e.SubjectId).HasMaxLength(200);

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<TypeColloque>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Nom).IsRequired();
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
