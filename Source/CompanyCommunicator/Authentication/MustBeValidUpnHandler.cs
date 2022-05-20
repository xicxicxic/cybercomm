﻿// <copyright file="MustBeValidUpnHandler.cs" company="Microsoft">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// </copyright>

namespace Microsoft.Teams.Apps.CompanyCommunicator.Authentication
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.Extensions.Options;

    /// <summary>
    /// This class is an authorization handler, which handles the authorization requirement.
    /// </summary>
    public class MustBeValidUpnHandler : AuthorizationHandler<MustBeValidUpnRequirement>
    {
        private readonly bool disableCreatorUpnCheck;
        private readonly string authorizedRole;
        private readonly HashSet<string> authorizedCreatorUpnsSet;

        /// <summary>
        /// Initializes a new instance of the <see cref="MustBeValidUpnHandler"/> class.
        /// </summary>
        /// <param name="authenticationOptions">The authentication options.</param>
        public MustBeValidUpnHandler(IOptions<AuthenticationOptions> authenticationOptions)
        {
            this.disableCreatorUpnCheck = authenticationOptions.Value.DisableCreatorUpnCheck;
            this.authorizedRole = authenticationOptions.Value.AuthorizedRole;
            var authorizedCreatorUpns = authenticationOptions.Value.AuthorizedCreatorUpns;
            this.authorizedCreatorUpnsSet = authorizedCreatorUpns
                ?.Split(new char[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries)
                ?.Select(p => p.Trim())
                ?.ToHashSet()
                ?? new HashSet<string>();
        }

        /// <summary>
        /// This method handles the authorization requirement.
        /// </summary>
        /// <param name="context">AuthorizationHandlerContext instance.</param>
        /// <param name="requirement">IAuthorizationRequirement instance.</param>
        /// <returns>A task that represents the work queued to execute.</returns>
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            MustBeValidUpnRequirement requirement)
        {
            if (this.disableCreatorUpnCheck || this.IsValidUpn(context) || this.HasValidRole(context))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }

        /// <summary>
        /// Check whether a upn is valid or not.
        /// This is where we should check against the valid list of UPNs.
        /// </summary>
        /// <param name="context">Authorization handler context instance.</param>
        /// <returns>Indicate if a upn is valid or not.</returns>
        private bool IsValidUpn(AuthorizationHandlerContext context)
        {
            var claim = context.User?.Claims?.FirstOrDefault(p => p.Type == ClaimTypes.Upn);
            var upn = claim?.Value;
            if (string.IsNullOrWhiteSpace(upn))
            {
                return false;
            }

            return this.authorizedCreatorUpnsSet.Contains(upn, StringComparer.OrdinalIgnoreCase);
        }

        /// <summary>
        /// Check whether a role is a valid authorized role or not.
        /// </summary>
        /// <param name="context">Authorization handler context instance.</param>
        /// <returns>Indicate if a role is valid or not.</returns>
        private bool HasValidRole(AuthorizationHandlerContext context)
        {
            var claim = context.User?.Claims?.FirstOrDefault(p => p.Type == ClaimTypes.Role);

            return claim?.Value?.Equals(this.authorizedRole) == true;
        }
    }
}
