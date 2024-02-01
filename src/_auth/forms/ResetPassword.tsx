import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { ResetPasswordValidation } from "@/lib/validation";
import { useResetPassword } from "@/lib/react-query/queries";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);


    // Access individual query parameters
    const userId = queryParams.get('userId') ?? '';
    const secret = queryParams.get('secret') ?? '';
    const expire = queryParams.get('expire') ?? '';


    const [isExpired, setisExpired] = useState(false);

    useEffect(() => {
        // Convert the expire string to a Date object

        if (expire !== null) {
            const expirationDate = new Date(expire);
            // date = new Date(value);

            // Get the current date and time
            const currentDate = new Date();



            // Check if the link has expired
            if (currentDate > expirationDate) {
                // Redirect to the sign-in page
                // navigate('/sign-in');
                setisExpired(true);
            }
        }


        // Add any other reset password logic here

    }, [expire, navigate]);

    const { toast } = useToast();


    // Query
    const { mutateAsync: ResetPassword, isLoading } = useResetPassword();

    const form = useForm<z.infer<typeof ResetPasswordValidation>>({
        resolver: zodResolver(ResetPasswordValidation),
        defaultValues: {
            password: "",
            confirm: "",
        },
    });

    const handleResetPassword = async (user: z.infer<typeof ResetPasswordValidation>) => {
        try {
            const PasswordUpdated = await ResetPassword({
                userId: userId,
                secret: secret,
                password: user.password,
            });

            if (PasswordUpdated) {
                toast({ title: "Password Updated Successfully !!, Please Login.", });

                navigate("/sign-in");

                return;
            }

        } catch (error: any) {

            if (error.code === 404) {

                toast({ title: "Account Not Found!!, Please try with correct Email !!", });
            } else {
                toast({ title: "Something went wrong, Please try again", });
            }

            // navigate("/forgot-password");

            return;
        }


    };


    return (
        <Form {...form}>
            <div className="ulxs:w-260 vxs:w-320 xs:w-420 sm:w-420 flex-col flex-center ">
                <img src="/assets/images/logo.svg" alt="logo" />
                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                    Reset Password
                </h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">
                    {!isExpired ? ("Please enter new password") : ("Link expired. Please Try again.")
                    }
                </p>
                {isExpired ? (

                    <p className="text-small-regular text-light-2 text-center mt-2">

                        <Link
                            to="/forgot-password"
                            className="text-primary-500 text-small-semibold ml-1">
                            Forgot Password
                        </Link>
                    </p>

                ) : (

                    <form
                        onSubmit={form.handleSubmit(handleResetPassword)}
                        className="flex flex-col gap-5 w-full mt-4 max-w-5xl">

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" className="shad-input" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Re-Enter Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" className="shad-input" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <Button type="submit" className="shad-button_primary">
                            {isLoading ? (
                                <div className="flex-center gap-2">
                                    <Loader /> Loading...
                                </div>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </form>

                )}

                <p className="text-small-regular text-light-2 text-center mt-2">

                    <Link
                        to="/sign-in"
                        className="text-primary-500 text-small-semibold ml-1">
                        Back to Home
                    </Link>
                </p>


            </div>
        </Form>
    )
}

export default ResetPassword
