using AutoMapper;
using ColloqueTshakapeshProject.Data;
using ColloqueTshakapeshProject.Filters;
using ColloqueTshakapeshProject.Hubs;
using ColloqueTshakapeshProject.Jobs;
using ColloqueTshakapeshProject.MiddlewareExtensions;
using ColloqueTshakapeshProject.Services;
using ColloqueTshakapeshProject.Utility;
using DinkToPdf;
using DinkToPdf.Contracts;
using Hangfire;
using Hangfire.SQLite;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;

namespace ColloqueTshakapeshProject
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup()
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: false)
                .AddJsonFile("extrasettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var context = new CustomAssemblyLoadContext();
            context.LoadUnmanagedLibrary(Path.Combine(Directory.GetCurrentDirectory(), @"ExternalBin\libwkhtmltox.dll"));

            services
                .AddSingleton<ICustomConfigManager, CustomConfigManager>();

            services
                .AddScoped<IJob, BackupDatabaseJob>();

            services
                .AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));

            services
                .AddMemoryCache();

            services
                .AddAutoMapper(typeof(Startup));

            services
                .AddDbContext<ColloqueTshakapeshDbContext>(options => options.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));

            services
                .AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddEntityFrameworkStores<ApplicationDbContext>();

            services
                .AddIdentityServer()
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

            services
                .AddHangfire(options =>
                {
                    options.UseSQLiteStorage(Configuration.GetConnectionString("HangfireConnection"));
                });

            services
                .AddTransient<IUnitOfWork, UnitOfWork>();

            services
                .AddScoped<IEmailSender, EmailSender>();

            services
                .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.Cookie.HttpOnly = true;
                    options.Cookie.SecurePolicy = CookieSecurePolicy.None;
                    options.Cookie.SameSite = SameSiteMode.Lax;
                })
                .AddIdentityServerJwt();

            services
                .AddControllersWithViews();

            services
                .AddCors(options =>
                {
                    options.AddPolicy("AllowAll", builder =>
                    {
                        builder
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                    });
                });

            // SignalR
            services
                .AddSignalR();

            // Add send email Config object
            services
                .Configure<EmailSenderSettings>(Configuration.GetSection("Services:SendEmailService"));

            // this settings are outside of appsettings.json, that's why I do it like that (not inside of node 'Services')
            services
                .Configure<ConfigModel>(Configuration.GetSection("Config"));

            services
                .AddRazorPages();

            // In production, the Angular files will be served from this directory
            services
                .AddSpaStaticFiles(configuration =>
                {
                    configuration.RootPath = "ClientApp/dist";
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider srv)
        {
            GlobalConfiguration.Configuration
                .UseActivator(new HangfireActivator(srv));

            if (env.IsDevelopment())
            {
                app
                    .UseDeveloperExceptionPage()
                    .UseDatabaseErrorPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app
                    .UseExceptionHandler("/Error")
                    .UseHsts();
            }

            app
                .UseHttpsRedirection()
                .UseStaticFiles();

            if (!env.IsDevelopment())
                app.UseSpaStaticFiles();

            app
                .UseRouting()
                .UseCookiePolicy()
                .UseAuthentication()
                .UseIdentityServer()
                .UseAuthorization()
                .UseEndpoints(endpoints =>
                {
                    endpoints.MapControllerRoute(
                        name: "default",
                        pattern: "{controller}/{action=Index}/{id?}");

                    endpoints.MapRazorPages();

                    endpoints.MapHub<MessageHub>("/MessageHub");
                })
                .UseCors("AllowAll")
                .UseHangfireDashboard("/hangfire", new DashboardOptions
                {
                    Authorization = new[] { new HangfireAuthorizationFilter() }
                })
                .UseHangfireServer()
                .UseSpa(spa =>
                {
                    // To learn more about options for serving an Angular SPA from ASP.NET Core,
                    // see https://go.microsoft.com/fwlink/?linkid=864501

                    spa.Options.SourcePath = "ClientApp";

                    if (env.IsDevelopment())
                    {
                        spa.UseAngularCliServer(npmScript: "start");
                    }
                });

            RecurringJob.RemoveIfExists(nameof(BackupDatabaseJob));
            RecurringJob.AddOrUpdate<IJob>((job) => job.ExecuteAsync(), "0 */2 * * *"); // chaque 2h, cron expression --> https://crontab.guru/
        }
    }
}
